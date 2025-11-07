import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  Video,
  Volume2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import type { CourseLesson } from '../types';
import { LessonType, ResourceType } from '../types';

interface CourseContentProps {
  lesson: CourseLesson;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  className?: string;
}

const CourseContent = ({
  lesson,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
  className,
}: CourseContentProps) => {
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  const getLessonTypeColor = (type: LessonType) => {
    switch (type) {
      case LessonType.VIDEO:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case LessonType.TEXT:
        return 'bg-green-100 text-green-800 border-green-200';
      case LessonType.QUIZ:
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case LessonType.ASSIGNMENT:
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case LessonType.DISCUSSION:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case ResourceType.PDF:
        return FileText;
      case ResourceType.VIDEO:
        return Video;
      case ResourceType.AUDIO:
        return Volume2;
      case ResourceType.LINK:
        return ExternalLink;
      default:
        return FileText;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  };

  const renderContent = () => {
    switch (lesson.type) {
      case LessonType.VIDEO:
        return (
          <div className="space-y-6">
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
                poster="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop"
              >
                <source src={lesson.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            {lesson.content && (
              <div className="prose prose-slate max-w-none">
                <ReactMarkdown>{lesson.content}</ReactMarkdown>
              </div>
            )}
          </div>
        );

      case LessonType.TEXT:
        return (
          <div className="prose prose-slate max-w-none">
            <ReactMarkdown>
              {lesson.content || 'No content available.'}
            </ReactMarkdown>
          </div>
        );

      case LessonType.QUIZ:
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
                Quiz: {lesson.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Test your knowledge with this interactive quiz.
              </p>
              <Button className="w-full">Start Quiz</Button>
            </CardContent>
          </Card>
        );

      case LessonType.ASSIGNMENT:
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
                  Assignment: {lesson.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-slate max-w-none">
                  <ReactMarkdown>
                    {lesson.content ||
                      'Assignment details will be available soon.'}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case LessonType.DISCUSSION:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                Discussion: {lesson.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Join the discussion with your fellow students and instructor.
              </p>
              <Button className="w-full">Join Discussion</Button>
            </CardContent>
          </Card>
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
              <Badge className={cn('text-xs', getLessonTypeColor(lesson.type))}>
                {lesson.type}
              </Badge>
              <div className="text-sm text-muted-foreground">
                {formatDuration(lesson.duration)}
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {lesson.title}
            </h1>
            {lesson.description && (
              <p className="text-muted-foreground">{lesson.description}</p>
            )}
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

            {/* Resources */}
            {lesson.resources && lesson.resources.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-8"
              >
                <Separator className="mb-6" />
                <h3 className="text-lg font-semibold mb-4">Resources</h3>
                <div className="grid gap-3">
                  {lesson.resources.map((resource) => {
                    const Icon = getResourceIcon(resource.type);
                    return (
                      <Card key={resource.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Icon className="w-5 h-5 text-primary" />
                              <div>
                                <h4 className="font-medium text-foreground">
                                  {resource.title}
                                </h4>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span>{resource.type}</span>
                                  {resource.size && (
                                    <>
                                      <span>•</span>
                                      <span>
                                        {formatFileSize(resource.size)}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2"
                              >
                                {resource.type === ResourceType.LINK ? (
                                  <>
                                    <ExternalLink className="w-4 h-4" />
                                    Open
                                  </>
                                ) : (
                                  <>
                                    <Download className="w-4 h-4" />
                                    Download
                                  </>
                                )}
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="p-6 border-t bg-card">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={!hasPrevious}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              onClick={onNext}
              disabled={!hasNext}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
