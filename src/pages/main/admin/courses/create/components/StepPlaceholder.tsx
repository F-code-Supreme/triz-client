import { useNavigate } from '@tanstack/react-router';
import {
  ChevronLeft,
  BookOpen,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  BarChart3,
} from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGetCourseByIdQuery } from '@/features/courses/services/queries';
import { formatTrizilium } from '@/utils';

type Props = {
  goBack: () => void;
  title: string;
  description: string;
};

const StepSummary: React.FC<Props> = ({ goBack, title, description }) => {
  const courseFromLocalStorage = localStorage.getItem('createCourseDraft_v1');
  const navigate = useNavigate();
  const courseId = courseFromLocalStorage
    ? JSON.parse(courseFromLocalStorage).id
    : null;
  const { data: courseData, isLoading } = useGetCourseByIdQuery(
    courseId || undefined,
  );

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Extract course details from response
  const course = courseData;
  const modules = course?.modules ?? [];
  const totalModules = course?.totalModules ?? 0;
  const totalLessons = course?.totalLessons ?? 0;

  // Calculate statistics
  const totalAssignments = modules.reduce((sum, module) => {
    return sum + (module.assignmentCount ?? 0);
  }, 0);

  const totalDuration = modules.reduce((sum, module) => {
    const duration =
      typeof module.durationInMinutes === 'number'
        ? module.durationInMinutes
        : 0;
    return sum + duration;
  }, 0);

  const handlePublish = async () => {
    if (totalModules === 0) {
      toast.error('Please add at least one module before publishing.');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement the actual API call to publish the course
      // await publishCourse(courseId);

      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 1500));
      localStorage.removeItem('createCourseDraft_v1');
      toast.success('Course published successfully!');
      // TODO: Redirect to course list or course detail page
      navigate({ to: '/admin/courses' });
    } catch (error) {
      let msg = 'Failed to publish course';
      if (error instanceof Error) msg = error.message;
      else if (typeof error === 'string') msg = error;
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level?.toUpperCase()) {
      case 'EASY':
      case 'STARTER':
        return 'bg-green-100 text-green-700 hover:bg-green-100/90';
      case 'MEDIUM':
      case 'INTERMEDIATE':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100/90';
      case 'HARD':
      case 'ADVANCED':
        return 'bg-red-100 text-red-700 hover:bg-red-100/90';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100/90';
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-md border p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-t-transparent border-blue-600 rounded-full animate-spin mb-4" />
            <p className="text-gray-600">Tải khóa học...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-blue-600 rounded" />
          <h2 className="text-xl font-semibold">Xem lại và xuất bản</h2>
        </div>
        {totalModules > 0 && totalLessons > 0 ? (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Sẵn sàng xuất bản
          </Badge>
        ) : (
          <Badge variant="secondary">
            <AlertCircle className="w-4 h-4 mr-1" />
            Chưa hoàn chỉnh
          </Badge>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Course Overview - Redesigned */}
        <Card className="overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Thumbnail Section */}
            {course?.thumbnailUrl && (
              <div className="lg:col-span-1 h-64 lg:h-auto">
                <div className="relative w-full h-full">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <Badge
                      className={`${getLevelBadgeColor(course?.level || 'N/A')} backdrop-blur-sm`}
                      variant="secondary"
                    >
                      <BarChart3 className="w-3 h-3 mr-1" />
                      {course?.level || 'N/A'}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Content Section */}
            <div
              className={`${course?.thumbnailUrl ? 'lg:col-span-2' : 'lg:col-span-3'} p-6`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {course?.title || title || 'Untitled Course'}
                  </h3>
                  {!course?.thumbnailUrl && course?.level && (
                    <Badge
                      className={getLevelBadgeColor(course?.level)}
                      variant="secondary"
                    >
                      <BarChart3 className="w-3 h-3 mr-1" />
                      {course?.level}
                    </Badge>
                  )}
                </div>
                {course?.price && (
                  <div className="text-right ml-4">
                    <p className="text-sm text-gray-500 mb-1">Giá khóa học</p>
                    <p className="text-3xl font-bold text-green-600">
                      {formatTrizilium(course.price)}
                    </p>
                    {course.dealPrice && course.dealPrice < course.price && (
                      <p className="text-sm text-gray-400 line-through">
                        {formatTrizilium(course.dealPrice)}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2 block">
                    Mô tả khóa học
                  </label>
                  <p className="text-gray-600 leading-relaxed">
                    {course?.description ||
                      description ||
                      'Chưa có mô tả cho khóa học này'}
                  </p>
                </div>

                {course?.shortDescription &&
                  course.shortDescription !== course.description && (
                    <div>
                      <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2 block">
                        Mô tả ngắn
                      </label>
                      <p className="text-sm text-gray-600">
                        {course.shortDescription}
                      </p>
                    </div>
                  )}

                {/* Additional Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-gray-500 mx-auto mb-1" />
                    <p className="text-xs text-gray-500 mb-1">Thời lượng</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {course?.durationInMinutes
                        ? `${course.durationInMinutes} phút`
                        : 'N/A'}
                    </p>
                  </div>

                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <BookOpen className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs text-blue-600 mb-1">Chương học</p>
                    <p className="text-sm font-semibold text-blue-900">
                      {totalModules}
                    </p>
                  </div>

                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <FileText className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <p className="text-xs text-green-600 mb-1">Bài học</p>
                    <p className="text-sm font-semibold text-green-900">
                      {totalLessons}
                    </p>
                  </div>

                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <FileText className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <p className="text-xs text-purple-600 mb-1">Bài tập</p>
                    <p className="text-sm font-semibold text-purple-900">
                      {totalAssignments}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                {/* <div className="flex items-center gap-2 pt-2">
                  <span className="text-sm font-medium text-gray-500">
                    Trạng thái:
                  </span>
                  <Badge
                    variant={
                      course?.status === 'ACTIVE' ? 'default' : 'secondary'
                    }
                    className={
                      course?.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-700 hover:bg-green-100'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                    }
                  >
                    {course?.status === 'ACTIVE'
                      ? 'Đang hoạt động'
                      : 'Chưa kích hoạt'}
                  </Badge>
                </div> */}
              </div>
            </div>
          </div>
        </Card>

        {/* Statistics Grid - Keep existing or remove if redundant */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Chương</p>
                <p className="text-2xl font-bold">{totalModules}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Bài học</p>
                <p className="text-2xl font-bold">{totalLessons}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Bài tập</p>
                <p className="text-2xl font-bold">{totalAssignments}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Thời lượng</p>
                <p className="text-2xl font-bold">
                  {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Modules Detail */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Chương khóa học
          </h3>

          {modules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>Chưa có chương nào được thêm</p>
              <p className="text-sm">
                Quay lại bước 2 để thêm chương, bài học và bài tập
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-base">{module.name}</h4>
                      <div className="flex items-center gap-3 mt-2">
                        {module.level && (
                          <Badge
                            className={getLevelBadgeColor(module.level)}
                            variant="secondary"
                          >
                            <BarChart3 className="w-3 h-3 mr-1" />
                            {module.level}
                          </Badge>
                        )}
                        {module.durationInMinutes > 0 && (
                          <span className="text-sm text-gray-600 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {module.durationInMinutes} min
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">
                        {module.lessonCount ?? 0} Bài học
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">
                        {module.assignmentCount ?? 0} Bài tập
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Warnings/Recommendations */}
        {(totalModules === 0 || totalLessons === 0) && (
          <Card className="p-4 border-yellow-200 bg-yellow-50">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900">
                  Khóa học chưa hoàn chỉnh
                </h4>
                <ul className="text-sm text-yellow-800 mt-2 space-y-1">
                  {totalModules === 0 && (
                    <li>• Thêm ít nhất một chương vào khóa học của bạn</li>
                  )}
                  {totalLessons === 0 && totalModules > 0 && (
                    <li>• Thêm bài học vào các chương của bạn</li>
                  )}
                </ul>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Footer Actions */}
      <div className="border-t">
        <div className="flex items-center justify-between p-6">
          <Button variant="outline" onClick={goBack} disabled={isSubmitting}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <Button
            onClick={handlePublish}
            disabled={isSubmitting || totalModules === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              'Đang xuất bản...'
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Xuất bản khóa học
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepSummary;
