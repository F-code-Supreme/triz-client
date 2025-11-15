import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Star, Users, Award, BookOpen } from 'lucide-react';
import { Link, useSearch } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import CourseSidebar from '@/features/course/components/course-sidebar';
import CourseContent from '@/features/course/components/course-content';
import {
  mockCourses,
  mockCurrentLesson,
} from '@/features/course/data/mock-courses';
import { CourseLevel } from '@/features/course/types';

function CourseDetail() {
  // Get query parameters
  const searchParams = useSearch({ from: '/course/detail' });
  const mode = (searchParams as any)?.mode || 'overview'; // 'overview' or 'learning'
  // const courseId = (searchParams as any)?.courseId; // TODO: Use this to fetch specific course

  // TODO: Fetch course by courseId, for now use mock
  const course = mockCourses[0];
  const [currentLessonId, setCurrentLessonId] = useState('lesson-2-5');
  const [activeTab, setActiveTab] = useState(
    mode === 'learning' ? 'content' : 'overview',
  );

  // Find current lesson
  const currentLesson = useMemo(() => {
    for (const week of course.weeks) {
      const lesson = week.lessons.find((l) => l.id === currentLessonId);
      if (lesson) return lesson;
    }
    return mockCurrentLesson;
  }, [currentLessonId, course.weeks]);

  // Navigation logic
  const allLessons = useMemo(() => {
    return course.weeks.flatMap((week) => week.lessons);
  }, [course.weeks]);

  const currentLessonIndex = allLessons.findIndex(
    (lesson) => lesson.id === currentLessonId,
  );
  const hasPrevious = currentLessonIndex > 0;
  const hasNext = currentLessonIndex < allLessons.length - 1;

  const handlePrevious = () => {
    if (hasPrevious) {
      setCurrentLessonId(allLessons[currentLessonIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      setCurrentLessonId(allLessons[currentLessonIndex + 1].id);
    }
  };

  const getLevelColor = (level: CourseLevel) => {
    switch (level) {
      case CourseLevel.BEGINNER:
        return 'bg-green-100 text-green-800 border-green-200';
      case CourseLevel.INTERMEDIATE:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case CourseLevel.ADVANCED:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Learning mode - Only accessible for enrolled courses
  if (mode === 'learning' && course.isEnrolled && activeTab === 'content') {
    return (
      <div className="h-screen flex flex-col">
        {/* Header */}
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
                {course.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>by {course.instructor}</span>
                <span>•</span>
                <span>{course.progress}% complete</span>
              </div>
            </div>

            {/* <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
            </Tabs> */}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-80 shrink-0">
            <CourseSidebar
              weeks={course.weeks}
              currentLessonId={currentLessonId}
              onLessonSelect={setCurrentLessonId}
            />
          </div>

          {/* Content Area */}
          <CourseContent
            lesson={currentLesson}
            onPrevious={handlePrevious}
            onNext={handleNext}
            hasPrevious={hasPrevious}
            hasNext={hasNext}
          />
        </div>
      </div>
    );
  }

  // Overview and other tabs content
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
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
          {/* Course Info */}
          <div className="md:col-span-2">
            <div className="flex items-start gap-4 mb-4">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs">
                    {course.category}
                  </Badge>
                  <Badge className={`text-xs ${getLevelColor(course.level)}`}>
                    {course.level}
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {course.title}
                </h1>
                <p className="text-muted-foreground mb-4">
                  {course.description}
                </p>

                {/* Instructor */}
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={course.instructorAvatar}
                      alt={course.instructor}
                    />
                    <AvatarFallback>
                      {course.instructor
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{course.instructor}</p>
                    <p className="text-sm text-muted-foreground">
                      Course Instructor
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Course Stats */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Course Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{course.duration}h total</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span>{course.totalLessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span>{course.rating}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{course.totalStudents.toLocaleString()}</span>
                  </div>
                </div>

                {course.isEnrolled ? (
                  <Button
                    className="w-full"
                    onClick={() => setActiveTab('content')}
                  >
                    Continue Learning
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => {
                      // TODO: Implement enroll logic
                      alert(`Enrolling in: ${course.title}`);
                    }}
                  >
                    Enroll Now
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {course.isEnrolled && (
            <>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="discussion">Discussion</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </>
          )}
        </TabsList>

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
                {course.weeks.map((week) => (
                  <div key={week.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{week.title}</h4>
                      <span className="text-sm text-muted-foreground">
                        {week.completedLessons}/{week.totalLessons} lessons
                      </span>
                    </div>
                    {week.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {week.description}
                      </p>
                    )}
                    <Progress
                      value={
                        week.totalLessons > 0
                          ? (week.completedLessons / week.totalLessons) * 100
                          : 0
                      }
                      className="h-2"
                    />
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
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {course.progress}%
                  </div>
                  <p className="text-muted-foreground">Course Completion</p>
                </div>

                <Progress value={course.progress} className="h-4" />

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-foreground">
                      {course.weeks.reduce(
                        (acc, week) => acc + week.completedLessons,
                        0,
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Completed Lessons
                    </p>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-foreground">
                      {course.totalLessons}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total Lessons
                    </p>
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
                Note-taking feature coming soon. Keep track of important
                concepts and insights.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CourseDetail;
