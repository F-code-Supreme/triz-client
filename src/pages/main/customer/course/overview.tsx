import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  Users,
  Award,
  BookOpen,
  CircleDollarSign,
} from 'lucide-react';

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import useAuth from '@/features/auth/hooks/use-auth';
import { useEnrollCourseMutation } from '@/features/courses/services/mutations';
import { useGetCourseByIdQuery } from '@/features/courses/services/queries';
import { useGetModuleByCourseQuery } from '@/features/modules/services/queries';
import { formatTrizilium } from '@/utils';

const CourseOverviewPage = () => {
  const search = useSearch({ from: `/course/$slug` });
  const { id } = search as { id: string };
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: course, isLoading, isError } = useGetCourseByIdQuery(id);
  const { data: modules, isLoading: isLoadingModules } =
    useGetModuleByCourseQuery(id);

  const enrollMutation = useEnrollCourseMutation();

  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'BEGINNER':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'INTERMEDIATE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ADVANCED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <Skeleton className="h-10 w-48 mb-6" />
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-start gap-4 mb-4">
                <Skeleton className="w-24 h-24 rounded-lg" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-6 w-full" />
                    ))}
                  </div>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-lg" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  if (isError || !course) return <div>Failed to load course.</div>;

  const handleEnroll = async () => {
    try {
      await enrollMutation.mutateAsync(course.id);
      navigate({
        to: '/course/learn/$slug',
        params: { slug: course.slug as string },
        search: { id: course.id },
        mask: { to: `/course/${course.slug}` },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert('Đăng ký thất bại!');
    }
  };

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
              Quay lại khóa học
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Course Info */}
          <div className="md:col-span-2">
            <div className="flex items-start gap-4 mb-4">
              <img
                src={
                  course.thumbnailUrl ||
                  course.thumbnail ||
                  '/default-course.jpg'
                }
                alt={course.title}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={`text-xs ${getLevelColor(course.level)}`}>
                    {course.level || 'Unknown'}
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {course.title}
                </h1>
                <p className="text-muted-foreground mb-4">
                  {course.description}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Course Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock />
                    <span>
                      {course.durationInMinutes
                        ? Math.floor(course.durationInMinutes / 60)
                        : 0}
                      h total
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen />
                    <span>{course.totalModules} modules</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users />
                    <span>
                      {course.learnerCount?.toLocaleString() || 0} students
                    </span>
                  </div>
                  {course.price && (
                    <div className="flex items-center gap-2">
                      <CircleDollarSign />
                      <span>
                        {formatTrizilium(course.dealPrice || course.price)}
                      </span>
                    </div>
                  )}
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="w-full" disabled={!user}>
                      {user ? 'Enroll Now' : 'Log in to enroll'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Enrollment</AlertDialogTitle>
                      <AlertDialogDescription>
                        Enrolling in:{' '}
                        <span className="font-semibold">{course.title}</span>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Close</AlertDialogCancel>
                      <AlertDialogAction autoFocus onClick={handleEnroll}>
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>What you&apos;ll learn</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Award className="w-5 h-5 text-primary mt-0.5" />
                <span>{course.shortDescription || course.description}</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {modules && modules.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Course Curriculum</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingModules ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {modules.map((module) => (
                    <div key={module.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{module.name}</h4>
                        <span className="text-sm text-muted-foreground">
                          {module.lessonCount} lessons
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Duration: {Math.floor(module.durationInMinutes / 60)}h{' '}
                        {module.durationInMinutes % 60}m
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CourseOverviewPage;
