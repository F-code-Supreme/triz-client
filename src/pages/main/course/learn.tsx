import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useSearch } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import CourseSidebar from '@/features/courses/components/course-sidebar';
import CourseContent from '@/features/courses/components/course-content';
import { useCourseContent } from '@/features/courses/hooks/use-course-content';
import { useGetLessonByModuleQuery } from '@/features/lesson/services/queries';
import { useGetModuleByCourseQuery } from '@/features/modules/services/queries';
import { useGetAssignmentModuleQuery } from '@/features/assignment/services/queries';
import { useGetQuizzByModulesQuery } from '@/features/quiz/service/queries';
import { useGetCourseByIdQuery } from '@/features/courses/services/queries';
import type { Module } from '@/features/modules/types';

function CourseLearnPage() {
  const search = useSearch({ from: '/course/learn/$slug' });
  const { id: courseId } = search as { id: string };

  const [currentItemId, setCurrentItemId] = useState<string>('');
  const [currentModuleId, setCurrentModuleId] = useState<string>('');

  const { data: courseData, isLoading: isLoadingCourse } =
    useGetCourseByIdQuery(courseId);

  const { data: modulesData, isLoading: isLoadingModules } =
    useGetModuleByCourseQuery(courseId);

  useEffect(() => {
    if (modulesData && modulesData.length > 0 && !currentModuleId) {
      setCurrentModuleId(modulesData[0].id);
    }
  }, [modulesData, currentModuleId]);

  const { data: lessonsData, isLoading: isLoadingLessons } =
    useGetLessonByModuleQuery(currentModuleId);
  const { data: assignmentsData } =
    useGetAssignmentModuleQuery(currentModuleId);
  const { data: quizzesData } = useGetQuizzByModulesQuery(currentModuleId);

  console.log('CourseLearnPage quizzesData:', quizzesData);

  const { enhancedModules, currentModule } = useCourseContent({
    modules: (modulesData as Module[]) || [],
    lessonsData,
    assignmentsData,
    quizzesData,
    currentModuleId,
  });

  useEffect(() => {
    if (currentModule && currentModule.contents.length > 0) {
      setCurrentItemId(currentModule.contents[0].id);
    }
  }, [currentModule]);

  const handleModuleChange = (moduleId: string) => {
    setCurrentModuleId(moduleId);
  };

  const handleItemChange = (itemId: string, moduleId: string) => {
    setCurrentItemId(itemId);
    if (moduleId !== currentModuleId) {
      setCurrentModuleId(moduleId);
    }
  };

  if (!courseData || !modulesData) {
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
}

export default CourseLearnPage;
