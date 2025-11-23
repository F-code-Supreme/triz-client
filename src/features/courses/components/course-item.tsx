import { Eye, Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDeleteCourseMutation } from '@/features/courses/services/mutations';
import { useGetCourseByIdQuery } from '@/features/courses/services/queries';

import type { Course } from '@/features/courses/types';

const CourseItem = ({ course }: { course: Course }) => {
  const thumbnail = course.thumbnailUrl ?? course.thumbnail ?? undefined;
  const deleteCourse = useDeleteCourseMutation();
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data: courseDetail, isLoading } = useGetCourseByIdQuery(
    isDetailOpen ? course.id : undefined,
  );

  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  });

  const dealPrice = course.dealPrice ?? course.price ?? null;
  const originalPrice = course.price ?? null;

  const handleDelete = () => {
    deleteCourse.mutate(course.id, {
      onSuccess: () => {
        toast.success('Xóa khóa học thành công');
        setIsDeleteOpen(false);
      },
      onError: () => {
        toast.error('Xóa khóa học thất bại. Vui lòng thử lại.');
      },
    });
  };

  return (
    <>
      <Card
        key={course.id}
        className="shadow-md hover:shadow-lg transition-shadow"
      >
        <CardContent className="p-0 ">
          <div className="overflow-hidden rounded-tr-md rounded-tl-md bg-gray-100">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={course.title}
                className="h-40 w-full object-cover"
              />
            ) : (
              <div className="flex h-40 w-full items-center justify-center text-sm text-muted-foreground">
                No image
              </div>
            )}
          </div>

          <div className="p-3">
            <div className="min-h-40">
              <h2 className="text-base font-semibold">{course.title}</h2>

              <p className="mb-2 text-sm text-muted-foreground">
                {course.shortDescription ?? course.description}
              </p>

              <div className="flex items-start justify-between gap-4">
                <div className="text-sm text-muted-foreground">
                  <div>Thời lượng: {course.durationInMinutes ?? 0} phút</div>
                  <div>Cấp độ: {course.level ?? 'N/A'}</div>
                  <div>Số lượng bài học: {course.orders?.length ?? 0}</div>
                </div>

                <div className="text-right">
                  {dealPrice !== null ? (
                    <div className="text-sm font-semibold text-primary">
                      {formatter.format(dealPrice)}
                    </div>
                  ) : null}

                  {originalPrice !== null &&
                  dealPrice !== null &&
                  originalPrice > dealPrice ? (
                    <div className="text-xs text-muted-foreground line-through">
                      {formatter.format(originalPrice)}
                    </div>
                  ) : null}

                  <div className="text-xs mt-1 text-muted-foreground">
                    <Badge
                      variant={
                        course.status === 'ACTIVE' ? 'secondary' : 'destructive'
                      }
                      className={`${course.status === 'ACTIVE' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                    >
                      {course.status ?? ''}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setIsDetailOpen(true)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsDeleteOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{course.title}</DialogTitle>
            <DialogDescription>Chi tiết khóa học</DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <div className="py-8 flex items-center justify-center gap-4 text-muted-foreground">
              <Loader2 className=" animate-spin" />
              Đang tải...
            </div>
          ) : courseDetail ? (
            <div className="space-y-4">
              {(courseDetail.thumbnailUrl ?? courseDetail.thumbnail) && (
                <img
                  src={courseDetail.thumbnailUrl ?? courseDetail.thumbnail}
                  alt={courseDetail.title}
                  className="w-full rounded-md object-cover"
                />
              )}
              <div>
                <h3 className="font-semibold mb-2">Mô tả</h3>
                <p className="text-sm text-muted-foreground">
                  {courseDetail.description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Thời lượng:</span>{' '}
                  {courseDetail.durationInMinutes} phút
                </div>
                <div>
                  <span className="font-semibold">Cấp độ:</span>{' '}
                  {courseDetail.level ?? 'N/A'}
                </div>
                <div>
                  <span className="font-semibold">Trạng thái:</span>{' '}
                  {courseDetail.status}
                </div>
                <div>
                  <span className="font-semibold">Người học:</span>{' '}
                  {courseDetail.learnerCount ?? 0}
                </div>
                {courseDetail.price !== null && (
                  <div>
                    <span className="font-semibold">Giá:</span>{' '}
                    {formatter.format(courseDetail.price)}
                  </div>
                )}
                {courseDetail.dealPrice !== null && (
                  <div>
                    <span className="font-semibold">Giá ưu đãi:</span>{' '}
                    {formatter.format(courseDetail.dealPrice)}
                  </div>
                )}
              </div>
              {courseDetail.modules && courseDetail.modules.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">
                    Chương ({courseDetail.totalModules})
                  </h3>
                  <div className="space-y-2">
                    {courseDetail.modules.map((module) => (
                      <div
                        key={module.id}
                        className="border rounded-md p-3 text-sm"
                      >
                        <div className="font-medium">{module.name}</div>
                        <div className="text-muted-foreground mt-1">
                          Thời lượng: {module.durationInMinutes} phút • Cấp độ:{' '}
                          {module.level} • Bài học: {module.lessonCount}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn?</AlertDialogTitle>
            <AlertDialogDescription>
              Sẽ xóa vĩnh viễn khóa học &quot;{course.title}
              &quot;. Hành động không thể thu hồi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteCourse.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CourseItem;
