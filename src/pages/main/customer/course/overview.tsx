import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  Users,
  Award,
  BookOpen,
  // CircleDollarSign,
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
import {
  getLevelColor,
  getLevelText,
  formatDurationVietnamese,
} from '@/features/courses/utils';
import { useGetModuleByCourseQuery } from '@/features/modules/services/queries';
// import { formatTrizilium } from '@/utils';

const CourseOverviewPage = () => {
  const search = useSearch({ from: `/course/$slug` });
  const { id } = search as { id: string };
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: course, isLoading, isError } = useGetCourseByIdQuery(id);
  const { data: modules, isLoading: isLoadingModules } =
    useGetModuleByCourseQuery(id);

  const sortedModulesData =
    modules && course?.orders
      ? [...modules].sort((a, b) => {
          const orderA = course.orders?.findIndex(
            (order) => order.moduleId === a.id,
          );
          const orderB = course.orders?.findIndex(
            (order) => order.moduleId === b.id,
          );
          return (orderA ?? -1) - (orderB ?? -1);
        })
      : modules;

  console.log('Module data:', sortedModulesData);

  const enrollMutation = useEnrollCourseMutation();

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
  if (isError || !course) return <div>Thất bại khi tải khóa học.</div>;

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

  console.log('Course level:', course.level);

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
                    {getLevelText(course.level)}
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
                <CardTitle className="text-lg">Thông tin khóa học</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock />
                    <span>
                      {course.durationInMinutes
                        ? Math.floor(course.durationInMinutes / 60)
                        : 0}{' '}
                      giờ
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen />
                    <span>{course.totalModules} mô-đun</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users />
                    <span>
                      {course.learnerCount?.toLocaleString() || 0} học viên
                    </span>
                  </div>
                  {/* {course.price && (
                    <div className="flex items-center gap-2">
                      <CircleDollarSign />
                      <span>
                        {formatTrizilium(course.dealPrice || course.price)}
                      </span>
                    </div>
                  )} */}
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="w-full" disabled={!user}>
                      {user ? 'Đăng ký ngay' : 'Đăng nhập để đăng ký'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Đăng ký khóa học</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bạn đang đăng ký:{' '}
                        <span className="font-semibold">{course.title}</span>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Đóng</AlertDialogCancel>
                      <AlertDialogAction autoFocus onClick={handleEnroll}>
                        Xác nhận
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
            <CardTitle>Bạn sẽ học được gì</CardTitle>
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

        {sortedModulesData && sortedModulesData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Chương trình học</CardTitle>
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
                  {sortedModulesData.map((module: any) => (
                    <div key={module.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{module.name}</h4>
                        <span className="text-sm text-muted-foreground">
                          {module.lessonCount} bài học
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Thời lượng:{' '}
                        {formatDurationVietnamese(module.durationInMinutes)}
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
