import { Card, CardContent } from '@/components/ui/card';

import type { Course } from '@/features/courses/types';

const CourseItem = ({ course }: { course: Course }) => {
  const thumbnail = course.thumbnailUrl ?? course.thumbnail ?? undefined;

  const formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  });

  const dealPrice = course.dealPrice ?? course.price ?? null;
  const originalPrice = course.price ?? null;

  return (
    <Card key={course.id}>
      <CardContent className="p-0">
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
          <h2 className="text-lg font-semibold">{course.title}</h2>

          <p className="mb-2 text-sm text-muted-foreground">
            {course.shortDescription ?? course.description}
          </p>

          <div className="flex items-start justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              <div>Duration: {course.durationInMinutes ?? 0} mins</div>
              <div>Level: {course.level ?? 'N/A'}</div>
              <div>Modules: {course.orders?.length ?? 0}</div>
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
                {course.status ?? ''}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseItem;
