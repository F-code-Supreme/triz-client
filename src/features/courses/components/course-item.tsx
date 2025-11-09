import { Card, CardContent } from '@/components/ui/card';

import type { Course } from '@/features/courses/types';

const CourseItem = ({ course }: { course: Course }) => {
  return (
    <Card key={course.id}>
      <CardContent className="p-0">
        <div className=" overflow-hidden rounded-tr-md rounded-tl-md">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="h-40 w-full object-cover"
          />
        </div>
        <div className="p-3">
          <h2 className="text-lg font-semibold">{course.title}</h2>
          <p className="mb-3 text-sm text-muted-foreground">
            {course.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseItem;
