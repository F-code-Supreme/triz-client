import { Link, useSearch } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useGetAssignmentModuleQuery } from '@/features/assignment/services/queries';
import { useGetMeQuery } from '@/features/auth/services/queries';

import CourseContent from '@/features/courses/components/course-content';
import CourseSidebar from '@/features/courses/components/course-sidebar';
import { useCourseContent } from '@/features/courses/hooks/use-course-content';
import { useCourseProgress } from '@/features/courses/hooks/use-course-progress';
import { useGetCourseByIdQuery } from '@/features/courses/services/queries';
import { useGetLessonByModuleQuery } from '@/features/lesson/services/queries';
import { useGetModuleByCourseQuery } from '@/features/modules/services/queries';
import { useGetQuizzByModulesQuery } from '@/features/quiz/service/queries';

import type { Module } from '@/features/modules/types';

const CourseLearnPage = () => {
  const search = useSearch({ from: '/(app)/course/learn/$slug' });
  const { id: courseId } = search as { id: string };

  const [currentItemId, setCurrentItemId] = useState<string>('');
  const [currentModuleId, setCurrentModuleId] = useState<string>('');

  const { data: userData } = useGetMeQuery();
  const userId = userData?.id;

  const { data: courseData, isLoading: isLoadingCourse } =
    useGetCourseByIdQuery(courseId);

  const { data: modulesData, isLoading: isLoadingModules } =
    useGetModuleByCourseQuery(courseId);

  // Sort modules based on the orders array from courseData
  const sortedModulesData =
    modulesData && courseData?.orders
      ? [...modulesData].sort((a, b) => {
          const orderA = courseData.orders?.findIndex(
            (order) => order.moduleId === a.id,
          );
          const orderB = courseData.orders?.findIndex(
            (order) => order.moduleId === b.id,
          );
          return (orderA ?? -1) - (orderB ?? -1);
        })
      : modulesData;

  useEffect(() => {
    if (sortedModulesData && sortedModulesData.length > 0 && !currentModuleId) {
      setCurrentModuleId(sortedModulesData[0].id);
    }
  }, [sortedModulesData, currentModuleId]);

  const { data: lessonsData, isLoading: isLoadingLessons } =
    useGetLessonByModuleQuery(currentModuleId);
  const { data: assignmentsData } =
    useGetAssignmentModuleQuery(currentModuleId);
  const { data: quizzesData } = useGetQuizzByModulesQuery(currentModuleId);

  // Collect all IDs for progress tracking
  const lessonIds = useMemo(() => {
    return lessonsData?.content?.map((lesson: any) => lesson.id) || [];
  }, [lessonsData]);

  const assignmentIds = useMemo(() => {
    return (
      assignmentsData?.content?.map((assignment: any) => assignment.id) || []
    );
  }, [assignmentsData]);

  const moduleIds = useMemo(() => {
    return sortedModulesData?.map((module) => module.id) || [];
  }, [sortedModulesData]);

  const {
    lessonProgressMap,
    assignmentProgressMap,
    moduleProgressMap,
    quizzProgressMap,
  } = useCourseProgress({
    lessonIds,
    assignmentIds,
    moduleIds,
    userId,
  });

  const {
    enhancedModules,
    currentModule,
    firstIncompleteItem,
    completedItemIds,
  } = useCourseContent({
    modules: (sortedModulesData as Module[]) || [],
    lessonsData,
    assignmentsData,
    quizzesData,
    currentModuleId,
    lessonProgressMap,
    assignmentProgressMap,
    moduleProgressMap,
    quizzProgressMap,
  });

  useEffect(() => {
    if (currentModule && currentModule.contents.length > 0) {
      const isCurrentItemInModule = currentModule.contents.some(
        (item) => item.id === currentItemId,
      );

      if (!isCurrentItemInModule && firstIncompleteItem) {
        setCurrentItemId(firstIncompleteItem.id);
      }
    }
  }, [currentModule, currentItemId, firstIncompleteItem]);

  const handleModuleChange = (moduleId: string) => {
    setCurrentModuleId(moduleId);
  };

  const handleItemChange = (itemId: string, moduleId: string) => {
    if (moduleId !== currentModuleId) {
      setCurrentModuleId(moduleId);
    }
    setCurrentItemId(itemId);
  };

  if (!courseData || !sortedModulesData) {
    if (isLoadingCourse || isLoadingModules) {
      return (
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading course content...</p>
          </div>
        </div>
      );
    }
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">
            Failed to load course content.
          </p>
          <Link to="/course/my-course">
            <Button variant="outline" className="mt-4">
              Back to My Courses
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-card border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/course/my-course">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to My Courses
              </Button>
            </Link>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <div className="flex flex-col justify-center items-center w-full">
            <h1 className="text-lg font-semibold truncate max-w-md">
              {courseData.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <CourseSidebar
          modules={enhancedModules}
          currentItemId={currentItemId}
          currentModuleId={currentModuleId}
          onItemSelect={handleItemChange}
          onModuleSelect={handleModuleChange}
          completedItemIds={completedItemIds}
        />

        <div className="flex-1 overflow-y-auto">
          {isLoadingLessons ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading content...</p>
              </div>
            </div>
          ) : (
            <CourseContent
              item={
                currentModule?.contents.find(
                  (item) => item.id === currentItemId,
                ) || null
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseLearnPage;
