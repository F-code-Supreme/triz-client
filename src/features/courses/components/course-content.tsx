import { useState } from 'react';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Link } from '@tanstack/react-router';

import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ModuleContentItem } from '../types';

interface CourseContentProps {
  item: ModuleContentItem | null;
  className?: string;
}

const CourseContent = ({ item, className }: CourseContentProps) => {
  const [isVideoLoading, setIsVideoLoading] = useState(true);

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
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  };

  const renderContent = () => {
    switch (item.type) {
      case 'lesson':
        const lessonData = item.lessonData;
        const isVideo =
          lessonData.materialUrl?.includes('video') ||
          lessonData.materialUrl?.includes('.mp4') ||
          lessonData.materialUrl?.includes('.webm');
        const isPDF = lessonData.materialUrl?.includes('.pdf');

        return (
          <div className="space-y-6">
            {/* Video Player */}
            {isVideo && (
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                {isVideoLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Loading video...</p>
                    </div>
                  </div>
                )}
                <video
                  className="w-full h-full"
                  controls
                  onLoadedData={() => setIsVideoLoading(false)}
                >
                  <source src={lessonData.materialUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            {/* PDF Viewer */}
            {isPDF && (
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <iframe
                  src={lessonData.materialUrl}
                  className="w-full h-full"
                  title={lessonData.name}
                />
              </div>
            )}

            {/* Text Content */}
            {!isVideo && !isPDF && (
              <Card>
                <CardContent className="p-6">
                  <div className="prose prose-slate max-w-none">
                    <p className="text-muted-foreground">
                      Material URL: {lessonData.materialUrl}
                    </p>
                    <a
                      href={lessonData.materialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Open Material
                    </a>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'quiz':
        const quizData = item.quizData;
        console.log('quizData in content', quizData.moduleId);
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
              {/* {quizData.imageSource && (
                <img
                  // src={quizData.imageSource}
                  alt={quizData.title}
                  className="w-full rounded-lg"
                />
              )} */}
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
                search={{ id: quizData.moduleId }}
                mask={{ to: `/course/quiz/${quizData.title}` as string }}
                className={cn(
                  buttonVariants({
                    variant: 'default',
                    size: 'default',
                  }),
                  'w-full',
                )}
              >
                Start Quiz
              </Link>
            </CardContent>
          </Card>
        );

      case 'assignment':
        const assignmentData = item.assignmentData;
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </div>
                  Assignment: {assignmentData.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-slate max-w-none">
                  <ReactMarkdown>{assignmentData.description}</ReactMarkdown>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      {formatDuration(assignmentData.durationInMinutes)}
                    </span>
                  </div>
                  <span>•</span>
                  <span>Max attempts: {assignmentData.maxAttempts}</span>
                </div>
                <Button className="w-full">Start Assignment</Button>
              </CardContent>
            </Card>
          </div>
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
        <div className="p-6 border-b bg-card">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-2">
              <Badge className={cn('text-xs', getItemTypeColor(item.type))}>
                {item.type.toUpperCase()}
              </Badge>
              {/* {item.duration && item.duration > 0 && (
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDuration(item.duration)}
                </div>
              )} */}
            </div>
            <h1 className="text-2xl font-bold text-foreground">{item.title}</h1>
          </motion.div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
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
