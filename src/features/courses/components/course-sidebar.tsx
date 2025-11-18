import {
  Check,
  Clock,
  PlayCircle,
  FileText,
  MessageCircle,
  PenTool,
  Lock,
} from 'lucide-react';
import { motion } from 'framer-motion';

import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

import type { CourseWeek } from '../../course/types';
import { LessonType } from '../../course/types';

interface CourseSidebarProps {
  weeks: CourseWeek[];
  currentLessonId?: string;
  onLessonSelect: (lessonId: string) => void;
  className?: string;
}

const CourseSidebar = ({
  weeks,
  currentLessonId,
  onLessonSelect,
  className,
}: CourseSidebarProps) => {
  const getLessonIcon = (type: LessonType) => {
    switch (type) {
      case LessonType.VIDEO:
        return PlayCircle;
      case LessonType.TEXT:
        return FileText;
      case LessonType.QUIZ:
        return PenTool;
      case LessonType.ASSIGNMENT:
        return PenTool;
      case LessonType.DISCUSSION:
        return MessageCircle;
      default:
        return FileText;
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  };

  return (
    <div className={cn('w-full bg-card border-r', className)}>
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Course Content
        </h2>
      </div>

      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="p-4 space-y-2">
          {weeks.map((week, weekIndex) => {
            return (
              <Collapsible
                key={week.id}
                defaultOpen={weekIndex === 0 || week.completedLessons > 0}
              >
                <CollapsibleTrigger className="w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: weekIndex * 0.1 }}
                    className={cn(
                      'w-full p-4 rounded-lg border text-left hover:bg-accent transition-colors',
                      !week.isUnlocked && 'opacity-60',
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={cn(
                            'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                            week.isUnlocked
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground',
                          )}
                        >
                          {week.isUnlocked ? (
                            week.order
                          ) : (
                            <Lock className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground line-clamp-1">
                            {week.title}
                          </h3>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          {week.completedLessons}/{week.totalLessons}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="ml-4 mt-2 space-y-1">
                    {week.lessons.map((lesson, lessonIndex) => {
                      const Icon = getLessonIcon(lesson.type);
                      const isCurrentLesson = lesson.id === currentLessonId;

                      return (
                        <motion.button
                          key={lesson.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.2,
                            delay: weekIndex * 0.1 + lessonIndex * 0.05,
                          }}
                          onClick={() =>
                            lesson.isUnlocked && onLessonSelect(lesson.id)
                          }
                          disabled={!lesson.isUnlocked}
                          className={cn(
                            'w-full p-3 rounded-md text-left transition-all group',
                            isCurrentLesson
                              ? 'bg-primary text-primary-foreground shadow-sm'
                              : 'hover:bg-accent',
                            !lesson.isUnlocked &&
                              'opacity-50 cursor-not-allowed',
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              {lesson.isCompleted ? (
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                  <Check className="w-3 h-3 text-white" />
                                </div>
                              ) : lesson.isUnlocked ? (
                                <Icon
                                  className={cn(
                                    'w-5 h-5',
                                    isCurrentLesson
                                      ? 'text-primary-foreground'
                                      : 'text-primary',
                                  )}
                                />
                              ) : (
                                <Lock className="w-5 h-5 text-muted-foreground" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4
                                  className={cn(
                                    'font-medium text-sm line-clamp-1',
                                    isCurrentLesson
                                      ? 'text-primary-foreground'
                                      : 'text-foreground',
                                  )}
                                >
                                  {lesson.title}
                                </h4>
                                <div className="flex items-center gap-2 ml-2">
                                  <div className="flex items-center gap-1">
                                    <Clock
                                      className={cn(
                                        'w-3 h-3',
                                        isCurrentLesson
                                          ? 'text-primary-foreground/70'
                                          : 'text-muted-foreground',
                                      )}
                                    />
                                    <span
                                      className={cn(
                                        'text-xs',
                                        isCurrentLesson
                                          ? 'text-primary-foreground/70'
                                          : 'text-muted-foreground',
                                      )}
                                    >
                                      {formatDuration(lesson.duration)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {lesson.description && (
                                <p
                                  className={cn(
                                    'text-xs line-clamp-1 mt-1',
                                    isCurrentLesson
                                      ? 'text-primary-foreground/70'
                                      : 'text-muted-foreground',
                                  )}
                                >
                                  {lesson.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CourseSidebar;
