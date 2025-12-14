import { useNavigate } from '@tanstack/react-router';
import {
  ChevronLeft,
  BookOpen,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  BarChart3,
  Video,
  FileCode,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGetAssignmentsByModuleQuery } from '@/features/assignment/services/queries';
import { usePublishCourseMutation } from '@/features/courses/services/mutations';
import { useGetCourseByIdQuery } from '@/features/courses/services/queries';
import { useGetLessonsByModuleQuery } from '@/features/lesson/services/queries';
import { useGetModulesByCourseQuery } from '@/features/modules/services/queries';
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
  const { data: modulesByCourseId } = useGetModulesByCourseQuery(
    courseId || '',
  );
  const publishCourseMutation = usePublishCourseMutation(courseId || '');

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Extract course details from response
  const course = courseData;
  const modules = modulesByCourseId?.content ?? [];
  const totalModules = course?.totalModules ?? 0;
  const totalLessons = course?.totalLessons ?? 0;

  const [expandedModules, setExpandedModules] = React.useState<Set<string>>(
    new Set(),
  );

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

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
      toast.error('Khóa học phải có ít nhất một chương để xuất bản');
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement the actual API call to publish the course
      // await publishCourse(courseId);
      await publishCourseMutation.mutateAsync(
        { status: 'ACTIVE' },
        {
          onSuccess: () => {
            toast.success('Xuất bản khóa học thành công!');
            localStorage.removeItem('createCourseDraft_v1');
            navigate({ to: '/admin/courses' });
          },
        },
      );
    } catch (error) {
      let msg = 'Xuất bản khóa học thất bại';
      if (error instanceof Error) msg = error.message;
      else if (typeof error === 'string') msg = error;
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ModuleDetailCard: React.FC<{ module: any }> = ({ module }) => {
    const { data: lessonsQuery } = useGetLessonsByModuleQuery(module.id || '');
    const { data: assignmentsQuery } = useGetAssignmentsByModuleQuery(
      module.id || '',
    );

    const lessons = lessonsQuery?.content ?? [];
    const assignments = assignmentsQuery?.content ?? [];
    const isExpanded = expandedModules.has(module.id);

    const getLessonTypeIcon = (type: string) => {
      switch (type?.toUpperCase()) {
        case 'VIDEO':
          return <Video className="w-4 h-4 text-blue-600" />;
        case 'TEXT':
          return <FileText className="w-4 h-4 text-gray-600" />;
        case 'CODE':
          return <FileCode className="w-4 h-4 text-purple-600" />;
        default:
          return <FileText className="w-4 h-4 text-gray-600" />;
      }
    };

    return (
      <div className="border rounded-lg bg-gray-50">
        <button
          type="button"
          aria-expanded={isExpanded}
          className="p-4 cursor-pointer hover:bg-gray-100 transition-colors text-left w-full"
          onClick={() => toggleModule(module.id)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-base">{module.name}</h4>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </div>
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
              <span className="text-gray-600">{lessons.length} Bài học</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">
                {assignments.length} Bài tập
              </span>
            </div>
          </div>
        </button>

        {/* Expanded content */}
        {isExpanded && (
          <div className="border-t bg-white p-4 space-y-4">
            {/* Lessons Section */}
            {lessons.length > 0 && (
              <div>
                <h5 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Bài học ({lessons.length})
                </h5>
                <div className="space-y-2">
                  {lessons.map((lesson: any, index: number) => (
                    <div
                      key={lesson.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded border"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {getLessonTypeIcon(lesson.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-500">
                            Bài {index + 1}
                          </span>
                          <Badge
                            variant={
                              lesson.status === 'ACTIVE'
                                ? 'default'
                                : 'secondary'
                            }
                            className={`text-xs ${
                              lesson.status === 'ACTIVE'
                                ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {lesson.status === 'ACTIVE'
                              ? 'Công khai'
                              : 'Chưa công khai'}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {lesson.title}
                        </p>
                        {lesson.description && (
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {lesson.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Assignments Section */}
            {assignments.length > 0 && (
              <div>
                <h5 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Bài tập ({assignments.length})
                </h5>
                <div className="space-y-2">
                  {assignments.map((assignment: any, index: number) => (
                    <div
                      key={assignment.id}
                      className="flex items-start gap-3 p-3 bg-purple-50 rounded border border-purple-200"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <FileText className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-500">
                            Bài tập {index + 1}
                          </span>
                          <Badge
                            variant={
                              assignment.status === 'ACTIVE'
                                ? 'default'
                                : 'secondary'
                            }
                            className={`text-xs ${
                              assignment.status === 'ACTIVE'
                                ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {assignment.status === 'ACTIVE'
                              ? 'Công khai'
                              : 'Chưa công khai'}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {assignment.title}
                        </p>
                        {assignment.description && (
                          <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                            {assignment.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          {assignment.durationInMinutes > 0 && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {assignment.durationInMinutes} phút
                            </span>
                          )}
                          {assignment.maxAttempts && (
                            <span>
                              Số lần làm tối đa: {assignment.maxAttempts}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {lessons.length === 0 && assignments.length === 0 && (
              <div className="text-center py-4 text-gray-500 text-sm">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>Chương này chưa có bài học hoặc bài tập</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
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
                <ModuleDetailCard key={module.id} module={module} />
              ))}
            </div>
          )}
        </Card>

        {/* Warnings/Recommendations */}
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
