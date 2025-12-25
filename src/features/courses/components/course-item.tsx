import { useNavigate } from '@tanstack/react-router';
import { Loader2, MoreHorizontal, Power, Trash2 } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useDeleteCourseMutation,
  usePublishCourseMutation,
} from '@/features/courses/services/mutations';
// import { formatTriziliumShort } from '@/utils';

import CourseLevelBadge from './course-level';
import CourseStatusBadge from './course-status';
import formatDuration from './format-duration';

import type { Course } from '@/features/courses/types';

const CourseItem = ({ course }: { course: Course }) => {
  const thumbnail = course.thumbnailUrl ?? course.thumbnail ?? undefined;
  const deleteCourse = useDeleteCourseMutation();
  const navigate = useNavigate();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const publishCourse = usePublishCourseMutation(course.id);

  // const dealPrice = course.dealPrice ?? course.price ?? null;
  // const originalPrice = course.price ?? null;

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
        <CardContent className="h-full p-0 relative flex flex-col">
          <div className="absolute top-2 right-2 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    const newStatus =
                      course.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
                    publishCourse.mutate(
                      { status: newStatus },
                      {
                        onSuccess: () => {
                          toast.success(
                            newStatus === 'ACTIVE'
                              ? 'Kích hoạt khóa học thành công'
                              : 'Đã hủy kích hoạt khóa học',
                          );
                        },
                        onError: () => {
                          toast.error(
                            'Cập nhật trạng thái thất bại. Vui lòng thử lại.',
                          );
                        },
                      },
                    );
                  }}
                  disabled={publishCourse.isPending}
                >
                  {publishCourse.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Power className="mr-2 h-4 w-4" />
                  )}
                  {course.status === 'ACTIVE' ? 'Hủy kích hoạt' : 'Kích hoạt'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsDeleteOpen(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="absolute top-2 left-2 z-10">
            <CourseStatusBadge status={course.status} />
          </div>

          <div className="absolute top-10 left-2 z-10">
            <CourseLevelBadge level={course.level} />
          </div>

          <div
            className="overflow-hidden rounded-tr-md rounded-tl-md bg-gray-100 cursor-pointer flex-shrink-0"
            onClick={() => navigate({ to: `/admin/courses/edit/${course.id}` })}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate({ to: `/admin/courses/edit/${course.id}` });
              }
            }}
            role="button"
            tabIndex={0}
          >
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={course.title}
                className="h-72 w-full object-cover"
              />
            ) : (
              <div className="flex h-72 w-full items-center justify-center text-sm text-muted-foreground">
                No image
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col p-3 min-h-0">
            <div className="flex-1 min-h-0 mb-2">
              <h2 className="text-base font-semibold truncate">
                {course.title}
              </h2>

              <p className="text-xs text-muted-foreground line-clamp-2 overflow-hidden">
                {course.shortDescription ?? course.description}
              </p>
            </div>

            <div className="flex items-end gap-4 w-full">
              <div className="text-xs text-muted-foreground w-[55%] space-y-1">
                <div>
                  Thời lượng: {formatDuration(course.durationInMinutes)}
                </div>
                <div>Số lượng bài học: {course.orders?.length ?? 0}</div>
              </div>

              {/* <div className="text-right text-xs w-[45%] flex flex-col items-end space-y-1">
                {dealPrice !== null ? (
                  <div className="text-sm font-semibold text-primary">
                    {formatTriziliumShort(dealPrice)}
                  </div>
                ) : null}

                {originalPrice !== null &&
                dealPrice !== null &&
                originalPrice > dealPrice ? (
                  <div className="text-muted-foreground line-through">
                    {formatTriziliumShort(originalPrice)}
                  </div>
                ) : null}
              </div> */}
            </div>
          </div>
        </CardContent>
      </Card>

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
