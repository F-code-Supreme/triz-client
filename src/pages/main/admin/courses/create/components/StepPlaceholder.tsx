import {
  ChevronLeft,
  BookOpen,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  BarChart3,
} from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGetAssignmentsQuery } from '@/features/assignment/services/queries';
import { useGetLessonsQuery } from '@/features/lesson/services/queries';
import { useGetModulesQuery } from '@/features/modules/services/queries';

type Props = {
  goBack: () => void;
  courseId?: string | null;
  title: string;
  description: string;
};

const StepSummary: React.FC<Props> = ({
  goBack,
  courseId,
  title,
  description,
}) => {
  const { data: modulesData } = useGetModulesQuery();
  const { data: lessonsData } = useGetLessonsQuery();
  const { data: assignmentsData } = useGetAssignmentsQuery();

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const modules = modulesData?.content ?? [];
  const lessons = lessonsData?.content ?? [];
  const assignments = assignmentsData?.content ?? [];

  // Calculate statistics
  const totalModules = modules.length;
  const totalLessons = lessons.length;
  const totalAssignments = assignments.length;
  const totalDuration = modules.reduce((sum, m) => {
    const duration =
      typeof m.durationInMinutes === 'number' ? m.durationInMinutes : 0;
    return sum + duration;
  }, 0);

  const handlePublish = async () => {
    if (!courseId) {
      toast.error(
        'Course ID is missing. Please go back and create the course.',
      );
      return;
    }

    if (totalModules === 0) {
      toast.error('Please add at least one module before publishing.');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement the actual API call to publish the course
      // await publishCourse(courseId);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success('Course published successfully!');
      // TODO: Redirect to course list or course detail page
      // navigate('/admin/courses');
    } catch (error) {
      let msg = 'Failed to publish course';
      if (error instanceof Error) msg = error.message;
      else if (typeof error === 'string') msg = error;
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level?.toUpperCase()) {
      case 'EASY':
      case 'STARTER':
        return 'bg-green-100 text-green-700 hover:bg-green-100/90';
      case 'MEDIUM':
      case 'INTERMEDIATE':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100/90';
      case 'HARD':
      case 'ADVANCED':
        return 'bg-red-100 text-red-700 hover:bg-red-100/90';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100/90';
    }
  };

  return (
    <div className="rounded-md border">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-blue-600 rounded" />
          <h2 className="text-xl font-semibold">Review & Publish</h2>
        </div>
        {totalModules > 0 && totalLessons > 0 ? (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Ready to Publish
          </Badge>
        ) : (
          <Badge variant="secondary">
            <AlertCircle className="w-4 h-4 mr-1" />
            Incomplete
          </Badge>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Course Overview */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Course Overview</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Title</label>
              <p className="text-base font-medium mt-1">
                {title || 'Untitled Course'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Description
              </label>
              <p className="text-sm text-gray-700 mt-1">
                {description || 'No description provided'}
              </p>
            </div>
          </div>
        </Card>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Modules</p>
                <p className="text-2xl font-bold">{totalModules}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Lessons</p>
                <p className="text-2xl font-bold">{totalLessons}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Assignments</p>
                <p className="text-2xl font-bold">{totalAssignments}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="text-2xl font-bold">
                  {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Modules Detail */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Course Content
          </h3>

          {modules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No modules added yet</p>
              <p className="text-sm">
                Go back to step 2 to add modules, lessons, and assignments
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {modules.map((module, idx) => {
                const asRecord = (v: unknown) => v as Record<string, unknown>;
                const m = asRecord(module);
                const moduleId = (m.id as string) ?? '';
                const moduleName =
                  (m.name as string) ??
                  (m.title as string) ??
                  `Module ${idx + 1}`;
                const moduleLevel = (m.level as string) ?? '';
                const moduleDuration =
                  typeof m.durationInMinutes === 'number'
                    ? m.durationInMinutes
                    : 0;

                const moduleLessons = lessons.filter((l) => {
                  const lessonRecord = l as unknown as Record<string, unknown>;
                  return lessonRecord.moduleId === moduleId;
                });
                const moduleAssignments = assignments.filter((a) => {
                  const assignmentRecord = a as unknown as Record<
                    string,
                    unknown
                  >;
                  return assignmentRecord.moduleId === moduleId;
                });

                return (
                  <div
                    key={moduleId}
                    className="border rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-base">{moduleName}</h4>
                        <div className="flex items-center gap-3 mt-2">
                          {moduleLevel && (
                            <Badge
                              className={getLevelBadgeColor(moduleLevel)}
                              variant="secondary"
                            >
                              <BarChart3 className="w-3 h-3 mr-1" />
                              {moduleLevel}
                            </Badge>
                          )}
                          {moduleDuration > 0 && (
                            <span className="text-sm text-gray-600 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {moduleDuration} min
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t">
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">
                          {moduleLessons.length} Lesson
                          {moduleLessons.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">
                          {moduleAssignments.length} Assignment
                          {moduleAssignments.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Warnings/Recommendations */}
        {(totalModules === 0 || totalLessons === 0) && (
          <Card className="p-4 border-yellow-200 bg-yellow-50">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900">
                  Course Incomplete
                </h4>
                <ul className="text-sm text-yellow-800 mt-2 space-y-1">
                  {totalModules === 0 && (
                    <li>• Add at least one module to your course</li>
                  )}
                  {totalLessons === 0 && totalModules > 0 && (
                    <li>• Add lessons to your modules</li>
                  )}
                </ul>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Footer Actions */}
      <div className="border-t">
        <div className="flex items-center justify-between p-6">
          <Button variant="outline" onClick={goBack} disabled={isSubmitting}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={handlePublish}
            disabled={isSubmitting || totalModules === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              'Publishing...'
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Publish Course
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepSummary;
