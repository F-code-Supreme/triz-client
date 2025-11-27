import { useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import {
  Clock,
  CheckCircle2,
  FileText,
  AlertCircle,
  History,
} from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MinimalTiptapEditor } from '@/components/ui/minimal-tiptap';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  useGetAssignmentModuleQuery,
  useSubmitAssignmentMutation,
  useGetAssignmentSubmissionHistoryQuery,
} from '@/features/assignment/services/queries';
import { AssignmentKeys } from '@/features/assignment/services/queries/keys';
import useAuth from '@/features/auth/hooks/use-auth';

import type { Content } from '@tiptap/react';

interface CourseAssignmentProps {
  moduleId: string;
  assignmentId: string;
  assignmentTitle: string;
  assignmentDescription: string;
  durationInMinutes: number;
  maxAttempts: number;
}

const CourseAssignment = ({
  moduleId,
  assignmentId,
  assignmentTitle,
  assignmentDescription,
  durationInMinutes,
  maxAttempts,
}: CourseAssignmentProps) => {
  const [answer, setAnswer] = useState<Content>('');
  const [attemptCount, setAttemptCount] = useState(0);
  const [showHistory, setShowHistory] = useState(false);

  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { isLoading } = useGetAssignmentModuleQuery(moduleId);
  const { mutate: submitAssignment, isPending: isSubmitting } =
    useSubmitAssignmentMutation();
  const { data: submissionHistory, isLoading: isLoadingHistory } =
    useGetAssignmentSubmissionHistoryQuery(user?.id, assignmentId);

  const formatDuration = (minutes: number) => {
    if (!minutes) return '';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  };

  const handleSubmit = () => {
    const submissionText =
      typeof answer === 'string' ? answer : JSON.stringify(answer);
    if (!submissionText.trim() || !user) return;

    submitAssignment(
      {
        title: assignmentTitle,
        submissionContent: submissionText,
        assignmentId,
        userId: user.id,
      },
      {
        onSuccess: () => {
          toast.success('Assignment submitted successfully!');
          setAttemptCount((prev) => prev + 1);
          // Invalidate history query to refresh submission history
          queryClient.invalidateQueries({
            queryKey: [
              AssignmentKeys.GetAssignmentSubmissionHistoryQuery,
              user.id,
              assignmentId,
            ],
          });
        },
        onError: (error: any) => {
          toast.error(
            error.response?.data?.message ||
              'Failed to submit assignment. Please try again.',
          );
        },
      },
    );
  };

  const canSubmit = attemptCount < maxAttempts;
  const remainingAttempts = maxAttempts - attemptCount;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading assignment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex justify-between">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-orange-600" />
                  </div>
                  {assignmentTitle}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHistory(true)}
                >
                  <History className="w-4 h-4 mr-1" />
                  History
                </Button>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(durationInMinutes)}</span>
                </div>
                <span>•</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="flex items-center gap-1 cursor-help">
                        <AlertCircle className="w-4 h-4" />
                        {remainingAttempts} attempt
                        {remainingAttempts !== 1 && 's'} left
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        You have {remainingAttempts} out of {maxAttempts}{' '}
                        attempts remaining
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-slate max-w-none">
            <ReactMarkdown>{assignmentDescription}</ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Before you start
            </h4>
            <ul className="text-sm text-blue-800 space-y-1 ml-5 list-disc">
              <li>Read the assignment description carefully</li>
              <li>
                You have {maxAttempts} attempt{maxAttempts !== 1 && 's'} to
                complete this assignment
              </li>
              <li>Make sure to save your work before submitting</li>
              <li>You can use the tooltip hints for guidance</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Your Answer</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <TooltipProvider>
              <Tooltip>
                <div>
                  <MinimalTiptapEditor
                    value={answer}
                    onChange={setAnswer}
                    output="html"
                    placeholder="Type your answer here..."
                    editorContentClassName="min-h-[200px] p-4"
                    editable={canSubmit}
                  />
                </div>
                {!answer && (
                  <TooltipContent side="bottom">
                    <p>Click here to start typing your answer</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {typeof answer === 'string'
                  ? answer.length
                  : JSON.stringify(answer).length}{' '}
                characters
              </span>
              {!canSubmit && attemptCount >= maxAttempts && (
                <span className="text-red-600">Maximum attempts reached</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      !canSubmit ||
                      !(typeof answer === 'string'
                        ? answer.trim()
                        : JSON.stringify(answer).trim()) ||
                      isSubmitting
                    }
                    className="flex-1"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
                  </Button>
                </TooltipTrigger>
                {!(typeof answer === 'string'
                  ? answer.trim()
                  : JSON.stringify(answer).trim()) && (
                  <TooltipContent>
                    <p>Please write your answer before submitting</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Submission History
            </DialogTitle>
            <DialogDescription>
              View all your previous assignment submissions and their status.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {isLoadingHistory ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading history...</p>
                </div>
              </div>
            ) : submissionHistory?.content &&
              submissionHistory.content.length > 0 ? (
              submissionHistory.content.map((submission) => (
                <Card key={submission.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-base">
                          Attempt #{submission.attemptNumber}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Submitted{' '}
                          {formatDistanceToNow(new Date(submission.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          variant={
                            {
                              APPROVED: 'default',
                              REJECTED: 'destructive',
                              PENDING: 'secondary',
                              AI_PENDING: 'secondary',
                            }[submission.status] as any
                          }
                        >
                          {submission.status}
                        </Badge>
                        {submission.gradedAt && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CheckCircle2 className="w-3 h-3" />
                            Graded{' '}
                            {formatDistanceToNow(
                              new Date(submission.gradedAt),
                              {
                                addSuffix: true,
                              },
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Your Answer:</h4>
                      <div className="prose prose-sm max-w-none bg-muted p-4 rounded-lg">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: submission.submissionContent,
                          }}
                        />
                      </div>
                    </div>
                    {submission.expertComment && (
                      <div>
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Expert Feedback:
                        </h4>
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                          <p className="text-sm text-blue-900">
                            {submission.expertComment}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                      {submission.isAiPassed !== null && (
                        <div className="flex items-center gap-1">
                          <span>AI Review:</span>
                          <Badge
                            variant={
                              submission.isAiPassed ? 'default' : 'secondary'
                            }
                            className="text-xs"
                          >
                            {submission.isAiPassed ? 'Passed' : 'Not Passed'}
                          </Badge>
                        </div>
                      )}
                      {submission.isExpertPassed !== null && (
                        <div className="flex items-center gap-1">
                          <span>Expert Review:</span>
                          <Badge
                            variant={
                              submission.isExpertPassed
                                ? 'default'
                                : 'secondary'
                            }
                            className="text-xs"
                          >
                            {submission.isExpertPassed
                              ? 'Passed'
                              : 'Not Passed'}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <History className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No submission history yet. Submit your first assignment to see
                  it here.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseAssignment;
