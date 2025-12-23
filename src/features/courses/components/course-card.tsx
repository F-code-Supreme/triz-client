import { Link, useNavigate } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Clock, Users, Play, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Spinner } from '@/components/ui/shadcn-io/spinner';
import { cn } from '@/lib/utils';

import {
  useCourseProgressQuery,
  useGetMyEnrollmentsQuery,
} from '../services/queries';
import { getLevelColor, formatDuration } from '../utils';

import type { Course } from '@/features/courses/types';

interface CourseCardProps {
  course: Course;
  className?: string;
  isEnrolled?: boolean;
}

const CourseCard = ({
  course,
  className,
  isEnrolled = false,
}: CourseCardProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation('pages.courses');

  const { data: enrollmentsData, isLoading } = useGetMyEnrollmentsQuery();

  const checkEnrolled = enrollmentsData?.content.some(
    (enrollment) => enrollment.courseId === course.id,
  );

  const { data: progressData } = useCourseProgressQuery(course.id || '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('flex flex-col min-h-[500px] h-full', className)}
    >
      <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-all duration-300 group">
        <div className="relative w-full h-48 bg-gradient-to-br from-sky-200 to-blue-400 overflow-hidden">
          <img
            src={
              course.thumbnailUrl || course.thumbnail || '/default-course.jpg'
            }
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <CardContent className="flex-1 p-4 space-y-3 flex flex-col justify-between">
          {/* Course Level */}
          <div className="flex items-center justify-between">
            <Badge className={cn('text-xs', getLevelColor(course.level))}>
              {t(`filters.${course.level?.toLowerCase() as string}` as any) ||
                'Unknown'}
            </Badge>
          </div>

          {/* Course Title */}
          <div>
            <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-tight">
              {course.title}
            </h3>
          </div>

          {/* Course Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {course.shortDescription}
          </p>

          {/* Course Stats */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(course.durationInMinutes)}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{course.learnerCount} students</span>
            </div>
          </div>

          {isLoading ? (
            <Spinner className="mr-2 h-4 w-4" />
          ) : (
            checkEnrolled && (
              <div className="mt-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Tiến độ khóa học: {progressData?.percentCompleted || 0}%
                </span>
                <Progress
                  value={progressData?.percentCompleted || 0}
                  className="h-3"
                />
              </div>
            )
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0">
          {isEnrolled ? (
            <Button
              onClick={() => {
                navigate({
                  to: '/course/learn/$slug',
                  params: { slug: course.slug as string },
                  search: { id: course.id },
                  mask: { to: `/course/${course.slug}` },
                });
              }}
              className="w-full"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Tiếp tục khóa học
            </Button>
          ) : (
            <Link
              to="/course/$slug"
              params={{ slug: course.slug as string }}
              search={{ id: course.id }}
              mask={{ to: `/course/${course.slug}/overview` as string }}
              className={cn(
                buttonVariants({
                  variant: 'default',
                  size: 'default',
                }),
                'w-full',
              )}
            >
              <Play className="w-4 h-4 mr-2" />
              Xem chi tiết khóa học
            </Link>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CourseCard;
