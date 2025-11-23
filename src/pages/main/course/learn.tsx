import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Users, Award, BookOpen } from 'lucide-react';
import { Link, useSearch } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  // Fetch course details
  const { data: courseData, isLoading: isLoadingCourse } =
    useGetCourseByIdQuery(courseId);

  // Fetch modules by course
  const { data: modulesData, isLoading: isLoadingModules } =
    useGetModuleByCourseQuery(courseId);

  // Set initial module ID when modules are loaded
  useMemo(() => {
    if (
      modulesData &&
      Array.isArray(modulesData) &&
      modulesData.length > 0 &&
      !currentModuleId
    ) {
      setCurrentModuleId(modulesData[0].id);
    }
  }, [modulesData, currentModuleId]);

  // Fetch lessons, assignments, and quizzes for current module
  const { data: lessonsData, isLoading: isLoadingLessons } =
    useGetLessonByModuleQuery(currentModuleId);
  const { data: assignmentsData } =
    useGetAssignmentModuleQuery(currentModuleId);
  const { data: quizzesData } = useGetQuizzByModulesQuery(currentModuleId);

  // Use custom hook to merge and transform content
  const { enhancedModules, currentModule } = useCourseContent({
    modules: (modulesData as Module[]) || [],
    lessonsData,
    assignmentsData,
    quizzesData,
    currentModuleId,
  });

  // Set initial item when module contents are loaded
  useMemo(() => {
    if (currentModule && currentModule.contents.length > 0 && !currentItemId) {
      setCurrentItemId(currentModule.contents[0].id);
    }
  }, [currentModule, currentItemId]);

  // Handle item selection
  const handleItemChange = (itemId: string, moduleId: string) => {
    setCurrentItemId(itemId);
    if (moduleId !== currentModuleId) {
      setCurrentModuleId(moduleId);
    }
  };

  // Loading state
  if (isLoadingCourse || isLoadingModules || isLoadingLessons) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading course content...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!courseData || !modulesData) {
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

  if (courseData && modulesData) {
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
          />

          <div className="flex-1 overflow-hidden">
            <CourseContent
              item={
                currentModule?.contents.find(
                  (item) => item.id === currentItemId,
                ) || null
              }
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-6">
          <Link to="/course">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Courses
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-start gap-4 mb-4">
              <img
                src={
                  courseData.thumbnailUrl ||
                  courseData.thumbnail ||
                  '/placeholder-course.jpg'
                }
                alt={courseData.title}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {courseData.level || 'All Levels'}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {courseData.status || 'ACTIVE'}
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {courseData.title}
                </h1>
                <p className="text-muted-foreground mb-4">
                  {courseData.description || courseData.shortDescription}
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      {courseData.durationInMinutes
                        ? `${Math.round(courseData.durationInMinutes / 60)}h`
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{courseData.learnerCount || 0} learners</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Course Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {courseData.durationInMinutes
                        ? `${Math.round(courseData.durationInMinutes / 60)}h`
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span>{courseData.totalLessons || 0} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{courseData.learnerCount || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span>{courseData.totalModules || 0} modules</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Price</span>
                    <span className="font-medium">
                      {courseData.dealPrice ? (
                        <>
                          <span className="line-through text-muted-foreground mr-2">
                            ${courseData.price}
                          </span>
                          <span className="text-primary">
                            ${courseData.dealPrice}
                          </span>
                        </>
                      ) : (
                        <span>${courseData.price || 0}</span>
                      )}
                    </span>
                  </div>
                </div>

                <Button className="w-full">Continue Learning</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      <TabsContent value="overview" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>What you'll learn</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Award className="w-5 h-5 text-primary mt-0.5" />
                <span>Master the fundamentals of TRIZ methodology</span>
              </li>
              <li className="flex items-start gap-2">
                <Award className="w-5 h-5 text-primary mt-0.5" />
                <span>Apply systematic problem-solving techniques</span>
              </li>
              <li className="flex items-start gap-2">
                <Award className="w-5 h-5 text-primary mt-0.5" />
                <span>Understand contradiction analysis and resolution</span>
              </li>
              <li className="flex items-start gap-2">
                <Award className="w-5 h-5 text-primary mt-0.5" />
                <span>Practice with real-world engineering problems</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Curriculum</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {enhancedModules.map((module) => (
                <div key={module.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{module.name}</h4>
                    <span className="text-sm text-muted-foreground">
                      {module.totalItems} items
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Duration: {module.durationInMinutes} mins | Level:{' '}
                    {module.level}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="progress" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Learning Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-foreground">
                    {courseData.totalModules || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Modules</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-foreground">
                    {courseData.totalLessons || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Lessons</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-foreground">
                    {courseData.learnerCount || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Learners</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="discussion" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Course Discussion</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              Discussion forum coming soon. Connect with fellow students and
              instructors.
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notes" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>My Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              Note-taking feature coming soon. Keep track of important concepts
              and insights.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
}

export default CourseLearnPage;
