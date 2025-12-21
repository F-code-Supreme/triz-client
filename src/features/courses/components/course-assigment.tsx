import { useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import {
  Clock,
  CheckCircle2,
  FileText,
  AlertCircle,
  History,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

import { Markdown } from '@/components/markdown/markdown';
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
import { Skeleton } from '@/components/ui/skeleton';
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
import { formatDateHour } from '@/utils/date/date';

import type { Content } from '@tiptap/react';

interface CourseAssignmentProps {
  moduleId: string;
  assignmentId: string;
  assignmentTitle: string;
  assignmentDescription: string;
  durationInMinutes: number;
  maxAttempts: number;
  criteria: string[];
}

const CourseAssignment = ({
  moduleId,
  assignmentId,
  assignmentTitle,
  assignmentDescription,
  durationInMinutes,
  maxAttempts,
  criteria,
}: CourseAssignmentProps) => {
  const [answer, setAnswer] = useState<Content>('');
  const [showHistory, setShowHistory] = useState(false);

  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { isLoading } = useGetAssignmentModuleQuery(moduleId);
  const { mutate: submitAssignment, isPending: isSubmitting } =
    useSubmitAssignmentMutation();
  const { data: submissionHistory, isLoading: isLoadingHistory } =
    useGetAssignmentSubmissionHistoryQuery(user?.id, assignmentId);

  const { t } = useTranslation('pages.courses');

  const [attemptCount, setAttemptCount] = useState(0);

  useEffect(() => {
    if (submissionHistory?.content) {
      setAttemptCount(submissionHistory.content.length);
    }
  }, [submissionHistory, moduleId]);

  const formatDuration = (minutes: number) => {
    if (!minutes) return '';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours} giờ ${remainingMinutes} phút`
      : `${hours} giờ`;
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
                  Lịch sử nộp bài
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
                      <span
                        className={`flex items-center gap-1 cursor-help ${attemptCount === maxAttempts ? 'text-red-600' : ''}`}
                      >
                        <AlertCircle className={`w-4 h-4 `} />
                        {attemptCount}/{maxAttempts} số lần nộp
                      </span>
                    </TooltipTrigger>
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
          <CardTitle className="text-lg">Tiêu chí</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Các Tiêu chí làm bài
            </h4>
            <ul className="text-sm text-blue-800 space-y-1 ml-5 list-disc">
              {criteria && criteria.length > 0 ? (
                criteria.map((item, idx) => <li key={idx}>{item}</li>)
              ) : (
                <li>Không có tiêu chí nào được cung cấp.</li>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Câu trả lời của bạn</span>
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
                    <p>Nhấp vào đây để bắt đầu nhập câu trả lời của bạn</p>
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
                <span className="text-red-600">Đã đạt số lần nộp tối đa</span>
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
                    {isSubmitting ? 'Đang nộp...' : 'Nộp bài'}
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
        <DialogContent className="max-w-4xl ">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Lịch sử nộp bài
            </DialogTitle>
            <DialogDescription>
              Xem tất cả các bài nộp trước đây của bạn và trạng thái của chúng.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 mt-2 max-h-[80vh] overflow-y-auto">
            {isLoadingHistory ? (
              <div className="py-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="lg:col-span-1 space-y-6">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                  <div className="lg:col-span-1 space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                </div>
              </div>
            ) : submissionHistory?.content &&
              submissionHistory.content.length > 0 ? (
              // eslint-disable-next-line sonarjs/cognitive-complexity
              submissionHistory.content.map((submission) => (
                <Card key={submission.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-base">
                          Bài nộp #{submission.attemptNumber}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {t('assignments.submission_date')}:{' '}
                          {formatDateHour(new Date(submission.createdAt))}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          className={
                            submission.status === 'EXPERT_PENDING'
                              ? 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                              : submission.status === 'AI_PENDING'
                                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                                : submission.status === 'APPROVED'
                                  ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                  : submission.status === 'AI_REJECTED' ||
                                      submission.status === 'REJECTED'
                                    ? 'bg-red-100 text-red-700 hover:bg-red-100'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                          }
                        >
                          {submission.status === 'EXPERT_PENDING'
                            ? 'Đang chờ đánh giá chuyên gia'
                            : submission.status === 'AI_PENDING'
                              ? 'Đang chờ đánh giá AI'
                              : submission.status === 'APPROVED'
                                ? 'Đã duyệt'
                                : submission.status === 'AI_REJECTED' ||
                                    submission.status === 'REJECTED'
                                  ? 'Bị từ chối'
                                  : 'Chưa xác định'}
                        </Badge>
                        {submission.gradedAt && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CheckCircle2 className="w-3 h-3" />
                            Đã chấm điểm{' '}
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
                      <h4 className="font-medium text-sm mb-2">
                        {t('assignments.your_answer')}:
                      </h4>
                      <div className="prose prose-sm max-w-none bg-muted p-4 rounded-lg">
                        <TooltipProvider>
                          <MinimalTiptapEditor
                            key={submission.id}
                            value={submission.submissionContent}
                            showToolbar={false}
                            editable={false}
                          />
                        </TooltipProvider>
                      </div>
                    </div>
                    {submission.expertComment && (
                      <div>
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Đánh giá của chuyên gia:
                        </h4>
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                          <p className="text-sm text-blue-900">
                            {submission.expertComment}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex flex-col gap-2 text-xs text-muted-foreground pt-2 border-t">
                      <div className="flex items-center gap-4">
                        {submission.isAiPassed !== null && (
                          <div className="flex items-center gap-1">
                            <span>{t('assignments.ai_review')}:</span>
                            <Badge
                              variant={
                                submission.isAiPassed ? 'default' : 'secondary'
                              }
                              className="text-xs"
                            >
                              {submission.isAiPassed ? 'Đạt' : 'Không đạt'}
                            </Badge>
                          </div>
                        )}
                        {submission.isExpertPassed !== null && (
                          <div className="flex items-center gap-1">
                            <span>{t('assignments.expert_review')}:</span>
                            <Badge
                              variant={
                                submission.isExpertPassed
                                  ? 'default'
                                  : 'secondary'
                              }
                              className="text-xs"
                            >
                              {submission.isExpertPassed ? 'Đạt' : 'Không đạt'}
                            </Badge>
                          </div>
                        )}
                      </div>
                      {submission.aiAnalysis && (
                        <div className="mt-2 space-y-3">
                          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                            <div className="font-semibold text-gray-800 mb-1">
                              {t('assignments.ai_analysis')}:
                            </div>
                            <div>{submission.aiAnalysis.assessmentSummary}</div>
                          </div>
                          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                            <div className="font-semibold text-gray-800 mb-1">
                              {t('assignments.overall_analysis')}
                            </div>
                            <div>{submission.aiAnalysis.overallAnalysis}</div>
                          </div>
                          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                            <div className="font-semibold text-gray-800 mb-1">
                              {t('assignments.resoning')}
                            </div>
                            <div>{submission.aiAnalysis.reasoning}</div>
                          </div>
                          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                            <div className="font-semibold text-gray-800 mb-1">
                              {t('assignments.criteria_analysis')}
                            </div>
                            <div>
                              <Markdown
                                content={submission.aiAnalysis.criteriaAnalysis}
                                className="text-xs"
                              />
                            </div>
                          </div>
                          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                            <div className="font-semibold text-gray-800 mb-1">
                              {t('assignments.strengths')}
                            </div>
                            {submission.aiAnalysis.strengthsList &&
                              submission.aiAnalysis.strengthsList.length >
                                0 && (
                                <ul className="list-disc ml-5 text-gray-700 mt-1">
                                  {submission.aiAnalysis.strengthsList.map(
                                    (item, idx) => (
                                      <li key={idx}>{item}</li>
                                    ),
                                  )}
                                </ul>
                              )}
                          </div>
                          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                            <div className="font-semibold text-gray-800 mb-1">
                              {t('assignments.improvements')}
                            </div>

                            {submission.aiAnalysis.areasForDevelopmentList &&
                              submission.aiAnalysis.areasForDevelopmentList
                                .length > 0 && (
                                <ul className="list-disc ml-5 text-gray-700 mt-1">
                                  {submission.aiAnalysis.areasForDevelopmentList.map(
                                    (item, idx) => (
                                      <li key={idx}>{item}</li>
                                    ),
                                  )}
                                </ul>
                              )}
                          </div>
                          <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                            <div className="font-semibold text-gray-800 mb-1">
                              {t('assignments.suggested_focus')}
                            </div>
                            <div>{submission.aiAnalysis.suggestedFocus}</div>
                          </div>
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
                  Chưa có bài tập nào được nộp.
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
