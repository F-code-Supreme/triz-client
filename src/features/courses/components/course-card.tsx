import { Link } from '@tanstack/react-router';
import { Clock, Star, Users, Play, CheckCircle, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

import type { Course } from '../../course/types';
import { CourseStatus, CourseLevel } from '../../course/types';

interface CourseCardProps {
  course: Course;
  className?: string;
}

const CourseCard = ({ course, className }: CourseCardProps) => {
  const getStatusColor = (status: CourseStatus) => {
    switch (status) {
      case CourseStatus.COMPLETED:
        return 'bg-green-500';
      case CourseStatus.IN_PROGRESS:
        return 'bg-blue-500';
      case CourseStatus.PAUSED:
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: CourseStatus) => {
    switch (status) {
      case CourseStatus.COMPLETED:
        return 'Completed';
      case CourseStatus.IN_PROGRESS:
        return 'In Progress';
      case CourseStatus.PAUSED:
        return 'Paused';
      default:
        return 'Not Started';
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

  const formatDuration = (hours: number) => {
    return `${hours}h`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('flex flex-col min-h-[500px] h-full', className)}
    >
      <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-all duration-300 group">
        {/* Course Thumbnail */}
        <Link to="/course/detail">
          <div className="relative w-full h-48 bg-gradient-to-br from-sky-200 to-blue-400 overflow-hidden">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Status Badge */}
            <div className="absolute top-3 right-3">
              <Badge
                className={cn(
                  'text-white font-medium',
                  getStatusColor(course.status),
                )}
              >
                {getStatusText(course.status)}
              </Badge>
            </div>
            {/* Completed Icon */}
            {course.status === CourseStatus.COMPLETED && (
              <div className="absolute top-3 left-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
            )}
          </div>
        </Link>

        {/* Progress Bar (only show if in progress) */}
        {course.status === CourseStatus.IN_PROGRESS && (
          <div className="px-4 pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Progress
              </span>
              <span className="text-sm font-medium text-primary">
                {course.progress}%
              </span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>
        )}

        <CardContent className="flex-1 p-4 space-y-3 flex flex-col justify-between">
          {/* Course Category & Level */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {course.category}
            </Badge>
            <Badge className={cn('text-xs', getLevelColor(course.level))}>
              {course.level}
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
            {course.description}
          </p>

          {/* Instructor */}
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage
                src={course.instructorAvatar}
                alt={course.instructor}
              />
              <AvatarFallback className="text-xs">
                {course.instructor
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground truncate">
              {course.instructor}
            </span>
          </div>

          {/* Course Stats */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(course.duration)}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{course.totalLessons} lessons</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{course.rating}</span>
            </div>
          </div>

          {/* Students Count */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{course.totalStudents.toLocaleString()} students</span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          {/* Action Buttons */}
          {course.isEnrolled ? (
            <Link
              to="/course/detail"
              search={{ mode: 'learning', courseId: course.id }}
              className={cn(
                buttonVariants({
                  variant:
                    course.status === CourseStatus.COMPLETED
                      ? 'outline'
                      : 'default',
                  size: 'default',
                }),
                'w-full',
              )}
            >
              {course.status === CourseStatus.COMPLETED ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Review Course
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Continue Learning
                </>
              )}
            </Link>
          ) : (
            <Link
              to="/course/detail"
              search={{ mode: 'overview', courseId: course.id }}
              className={cn(
                buttonVariants({
                  variant: 'default',
                  size: 'default',
                }),
                'w-full',
              )}
            >
              <Play className="w-4 h-4 mr-2" />
              Start
            </Link>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CourseCard;
