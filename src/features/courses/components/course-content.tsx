import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import CourseAssignment from './course-assigment';
import video from '../../../assets/images/clip5.1.mp4';

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
        // eslint-disable-next-line no-case-declarations
        const lessonData = item.lessonData;
        // const isVideo =
        //   lessonData.materialUrl?.includes('video') ||
        //   lessonData.materialUrl?.includes('.mp4') ||
        //   lessonData.materialUrl?.includes('.webm');
        // eslint-disable-next-line no-case-declarations
        const isPDF = lessonData.materialUrl?.includes('.pdf');

        return (
          <div className="space-y-6">
            {/* Video Player */}
            {/* {isVideo && (
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
            )} */}

            {/* test */}
            <div className="relative rounded-lg overflow-hidden">
              {isVideoLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading video...</p>
                  </div>
                </div>
              )}
              <video
                className="w-3/4 h-full mx-auto rounded-lg"
                controls
                onLoadedData={() => setIsVideoLoading(false)}
              >
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

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

            {/* {!isVideo && !isPDF && (
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
            )} */}
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
                mask={{ to: `/course/${quizData.title}/quizzes` as string }}
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
                {item.type.toUpperCase()}
              </Badge>
            </div>
            <h1 className="text-2xl font-bold text-foreground">{item.title}</h1>
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
