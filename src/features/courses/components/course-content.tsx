import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MinimalTiptapEditor } from '@/components/ui/minimal-tiptap';
import {
  VideoPlayer,
  VideoPlayerContent,
  VideoPlayerControlBar,
  VideoPlayerPlayButton,
  VideoPlayerSeekBackwardButton,
  VideoPlayerSeekForwardButton,
  VideoPlayerMuteButton,
  VideoPlayerTimeRange,
  VideoPlayerTimeDisplay,
  VideoPlayerVolumeRange,
} from '@/components/ui/shadcn-io/video-player';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useMarkLessonAsCompletedMutation } from '@/features/lesson/services/mutations';
import { useGetLessonProgressQuery } from '@/features/lesson/services/queries';
import { cn } from '@/lib/utils';

import CourseAssignment from './course-assigment';

import type { ModuleContentItem } from '../types';

interface CourseContentProps {
  item: ModuleContentItem | null;
  className?: string;
}

const CourseContent = ({ item, className }: CourseContentProps) => {
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  console.log('CourseContent item:', item);

  const lessonId = item?.type === 'lesson' ? item.lessonData?.id : undefined;
  const markLessonAsCompletedMutation = useMarkLessonAsCompletedMutation(
    lessonId || '',
  );
  const { data: lessonProgress } = useGetLessonProgressQuery(lessonId || '');

  if (!item) {
    return (
      <div className={cn('flex-1 overflow-hidden', className)}>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">
              Select a lesson to get started
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getItemTypeColor = (type: string) => {
    switch (type) {
      case 'lesson':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'quiz':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'assignment':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDuration = (minutes: number) => {
    if (!minutes) return '';
    if (minutes < 60) return `${minutes} phút`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours} giờ ${remainingMinutes} phút`
      : `${hours} giờ`;
  };

  const renderContent = () => {
    switch (item.type) {
      case 'lesson':
        // eslint-disable-next-line no-case-declarations
        const lessonData = item.lessonData;
        // eslint-disable-next-line no-case-declarations
        const isVideo =
          lessonData.videoUrl?.includes('video') ||
          lessonData.videoUrl?.includes('.mp4') ||
          lessonData.videoUrl?.includes('.webm');
        // eslint-disable-next-line no-case-declarations

        return (
          <div className="space-y-6">
            {/* Video Player */}
            {isVideo && (
              // <div className="relative aspect-video rounded-lg overflow-hidden">
              <div className="relative w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-5xl aspect-video mx-auto bg-black rounded-lg overflow-hidden">
                {isVideoLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading video...</p>
                    </div>
                  </div>
                )}

                <VideoPlayer>
                  <VideoPlayerContent
                    slot="media"
                    src={lessonData.videoUrl}
                    onLoadedData={() => setIsVideoLoading(false)}
                  />
                  <VideoPlayerControlBar>
                    <VideoPlayerPlayButton />
                    <VideoPlayerSeekBackwardButton />
                    <VideoPlayerSeekForwardButton />
                    <VideoPlayerMuteButton />
                    <VideoPlayerTimeRange />
                    <VideoPlayerTimeDisplay />
                    <VideoPlayerVolumeRange />
                  </VideoPlayerControlBar>
                </VideoPlayer>
              </div>
            )}

            {/* PDF Viewer */}
            {lessonData?.content && (
              <TooltipProvider>
                <MinimalTiptapEditor
                  key={item.id}
                  value={lessonData.content}
                  showToolbar={false}
                  editable={false}
                />
              </TooltipProvider>
            )}

            <div className="text-left">
              <Button
                onClick={async () => {
                  try {
                    await markLessonAsCompletedMutation.mutateAsync();
                    toast.success('Đã đánh dấu hoàn thành bài học!');
                  } catch (error: any) {
                    toast.error(
                      error?.response?.data?.message ||
                        'Có lỗi xảy ra khi đánh dấu hoàn thành. Vui lòng thử lại.',
                    );
                  }
                }}
                disabled={lessonProgress?.isCompleted}
              >
                {lessonProgress?.isCompleted
                  ? 'Bài học đã hoàn thành'
                  : 'Xác nhận hoàn thành'}
              </Button>
            </div>
          </div>
        );

      case 'quiz':
        // eslint-disable-next-line no-case-declarations
        const quizData = item.quizData;
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                {quizData.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-slate max-w-none">
                <ReactMarkdown>{quizData.description}</ReactMarkdown>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(quizData.durationInMinutes)}</span>
                </div>
              </div>

              <Link
                to="/course/quiz/$slug"
                params={{ slug: quizData.title as string }}
                search={{ quizId: quizData.id, moduleId: quizData.moduleId }}
                mask={{ to: `/course/${quizData.title}/quizzes` as string }}
                className={cn(
                  buttonVariants({
                    variant: 'default',
                    size: 'default',
                  }),
                  'w-full',
                )}
              >
                Bắt đầu làm bài
              </Link>
            </CardContent>
          </Card>
        );

      case 'assignment':
        // eslint-disable-next-line no-case-declarations
        const assignmentData = item.assignmentData;
        return (
          <CourseAssignment
            moduleId={assignmentData.moduleId}
            assignmentId={assignmentData.id}
            assignmentTitle={assignmentData.title}
            assignmentDescription={assignmentData.description}
            durationInMinutes={assignmentData.durationInMinutes}
            maxAttempts={assignmentData.maxAttempts}
            criteria={assignmentData.criteria || []}
          />
        );

      default:
        return (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Content not available</p>
          </div>
        );
    }
  };

  return (
    <div className={cn('flex-1 overflow-hidden', className)}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b bg-card">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-2">
              <Badge className={cn('text-xs', getItemTypeColor(item.type))}>
                {item.type.toUpperCase() === 'LESSON'
                  ? 'BÀI HỌC'
                  : item.type.toUpperCase() === 'QUIZ'
                    ? 'BÀI KIỂM TRA'
                    : item.type.toUpperCase() === 'ASSIGNMENT'
                      ? 'BÀI TẬP'
                      : item.type.toUpperCase()}
              </Badge>
            </div>
            <div className="flex flex-row items-center justify-between">
              <h1 className="text-2xl font-bold text-foreground">
                {item.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                {item.type === 'lesson' ? (
                  <>
                    {item.lessonData.durationInMinutes && (
                      <>
                        Thời gian:{' '}
                        {formatDuration(item.lessonData.durationInMinutes)}
                      </>
                    )}
                  </>
                ) : item.type === 'quiz' ? (
                  <>
                    {item.quizData.durationInMinutes && (
                      <>
                        Thời gian:{' '}
                        {formatDuration(item.quizData.durationInMinutes)}
                      </>
                    )}
                  </>
                ) : item.type === 'assignment' ? (
                  <>
                    {item.assignmentData.durationInMinutes && (
                      <>
                        Thời gian:{' '}
                        {formatDuration(item.assignmentData.durationInMinutes)}
                      </>
                    )}
                  </>
                ) : (
                  ''
                )}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
