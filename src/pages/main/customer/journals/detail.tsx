import { Link, useNavigate } from '@tanstack/react-router';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  Star,
  Share2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { usePublishSixStepJournalToForumMutation } from '@/features/6-steps/services/mutations';
import { useGetJournalByIdQuery } from '@/features/6-steps/services/queries';
import useAuth from '@/features/auth/hooks/use-auth';
import { DefaultLayout } from '@/layouts/default-layout';
import { Route } from '@/routes/(app)/journals/$journalId/route';

import type { PhysicalContradiction } from '@/features/6-steps/types';

const JournalDetailPage = () => {
  const { t } = useTranslation('pages.journals');
  const { journalId } = Route.useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    data: journal,
    isLoading,
    error,
  } = useGetJournalByIdQuery(user?.id, journalId);

  const publishToForumMutation = usePublishSixStepJournalToForumMutation();

  const handlePublishToForum = async () => {
    if (!user?.id || !journalId) {
      toast.error('Không thể xuất bản. Vui lòng thử lại.');
      return;
    }

    try {
      await publishToForumMutation.mutateAsync({
        userId: user.id,
        problemId: journalId,
      });

      toast.success('Xuất bản lên diễn đàn thành công!');

      // Navigate to forum page
      navigate({ to: '/forum' });
    } catch (error) {
      console.error('Failed to publish to forum:', error);
      toast.error('Có lỗi xảy ra khi xuất bản. Vui lòng thử lại.');
    }
  };

  const getStatusBadge = (status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED') => {
    switch (status) {
      case 'COMPLETED':
        return (
          <Badge variant="default" className="bg-green-600">
            {t('status_completed')}
          </Badge>
        );
      case 'IN_PROGRESS':
        return (
          <Badge variant="default" className="bg-blue-600">
            {t('status_in_progress')}
          </Badge>
        );
      case 'DRAFT':
        return (
          <Badge variant="outline" className="border-gray-500">
            {t('status_draft')}
          </Badge>
        );
      default:
        return null;
    }
  };

  const getStepProgress = (stepData: Record<string, unknown>) => {
    const steps = [
      'step1Understand',
      'step2Objectives',
      'step3Analysis',
      'step4Contradiction',
      'step5Ideas',
      'step6Decision',
    ];
    const completedSteps = steps.filter((step) => stepData[step]).length;
    return { completed: completedSteps, total: 6 };
  };

  const stepLabels = [
    'Bước 1: Hiểu vấn đề',
    'Bước 2: Xác định mục tiêu',
    'Bước 3: Phân tích hệ thống',
    'Bước 4: Phát biểu mâu thuẫn',
    'Bước 5: Phát triển ý tưởng',
    'Bước 6: Ra quyết định',
  ];

  if (isLoading) {
    return (
      <DefaultLayout meta={{ title: t('loading') }}>
        <div className="py-8 space-y-8">
          <Skeleton className="h-10 w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      </DefaultLayout>
    );
  }

  if (error || !journal) {
    return (
      <DefaultLayout meta={{ title: t('error_title') }}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <BookOpen className="h-16 w-16 text-muted-foreground opacity-50" />
          <h2 className="text-2xl font-bold">{t('no_journals')}</h2>
          <p className="text-muted-foreground">
            {t('no_journals_description')}
          </p>
          <Button onClick={() => navigate({ to: '/journals' })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Button>
        </div>
      </DefaultLayout>
    );
  }

  const progress = getStepProgress(journal.stepData || {});

  return (
    <DefaultLayout meta={{ title: journal.title }}>
      <div className="py-8 space-y-8">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/journals' })}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại danh sách nhật ký
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Status Card */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Thông tin</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <BookOpen className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-muted-foreground">{t('status')}</p>
                        <div className="mt-1">
                          {getStatusBadge(journal.status)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-muted-foreground">
                          {t('created_date')}
                        </p>
                        <p className="font-medium">
                          {new Date(journal.createdAt).toLocaleDateString(
                            'vi-VN',
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-muted-foreground">
                          {t('updated_date')}
                        </p>
                        <p className="font-medium">
                          {new Date(journal.updatedAt).toLocaleDateString(
                            'vi-VN',
                          )}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handlePublishToForum}
                      disabled={publishToForumMutation.isPending}
                      className="w-full"
                      variant="default"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      {publishToForumMutation.isPending
                        ? 'Đang xuất bản...'
                        : 'Xuất bản lên diễn đàn'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">{t('progress')}</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">
                        {t('status_completed')}
                      </span>
                      <span className="font-semibold">
                        {progress.completed}/{progress.total}{' '}
                        {t('steps_completed')}
                      </span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{
                          width: `${(progress.completed / progress.total) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <ul className="space-y-2 text-sm">
                    {stepLabels.map((label, index) => {
                      const stepKeys = [
                        'step1Understand',
                        'step2Objectives',
                        'step3Analysis',
                        'step4Contradiction',
                        'step5Ideas',
                        'step6Decision',
                      ];
                      const stepKey = stepKeys[index];
                      const isCompleted = !!(
                        journal.stepData as Record<string, unknown>
                      )[stepKey];
                      return (
                        <li
                          key={stepKey}
                          className={`flex items-center gap-2 p-2 rounded-md ${
                            isCompleted
                              ? 'bg-primary/10 text-primary'
                              : 'text-muted-foreground'
                          }`}
                        >
                          <CheckCircle2
                            className={`h-4 w-4 flex-shrink-0 ${
                              isCompleted
                                ? 'text-primary'
                                : 'text-muted-foreground'
                            }`}
                          />
                          <span className="flex-1">{label}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-4">{journal.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">
                Nhật ký giải quyết vấn đề theo phương pháp TRIZ 6 bước
              </p>
            </div>

            {/* Step Data Cards */}
            <div className="space-y-4">
              {journal.stepData.step1Understand && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      Bước 1: Hiểu bài toán
                    </h3>
                    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">
                          Vấn đề ban đầu:
                        </p>
                        <p className="text-sm whitespace-pre-wrap">
                          {journal.stepData.step1Understand.rawProblem}
                        </p>
                      </div>
                      {journal.stepData.step1Understand.selectedMiniProblem && (
                        <div className="space-y-2 pt-2 border-t">
                          <p className="text-xs font-medium text-muted-foreground">
                            Vấn đề nhỏ đã chọn:
                          </p>
                          <div className="text-sm font-semibold text-primary">
                            {
                              journal.stepData.step1Understand
                                .selectedMiniProblem
                            }
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {journal.stepData.step2Objectives && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      Bước 2: Đề ra mục đích cần đạt
                    </h3>
                    <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">
                          Mục tiêu:
                        </p>
                        <div className="text-sm font-semibold text-primary">
                          {journal.stepData.step2Objectives.goal}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {journal.stepData.step3Analysis && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      Bước 3: Trả lời các câu hỏi
                    </h3>
                    <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground">
                          Hệ thống xác định:
                        </p>
                        <p className="text-sm font-semibold">
                          {journal.stepData.step3Analysis.systemIdentified}
                        </p>
                      </div>
                      {journal.stepData.step3Analysis.elements &&
                        journal.stepData.step3Analysis.elements.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-muted-foreground">
                              Các yếu tố:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {journal.stepData.step3Analysis.elements.map(
                                (element: string, index: number) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium"
                                  >
                                    {element}
                                  </span>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                      {journal.stepData.step3Analysis.requiredStates && (
                        <div className="space-y-3">
                          <p className="text-xs font-medium text-muted-foreground">
                            Trạng thái yêu cầu:
                          </p>
                          {Object.entries(
                            journal.stepData.step3Analysis.requiredStates,
                          ).map(([element, states]) => (
                            <div key={element} className="space-y-1">
                              <p className="text-xs font-semibold text-primary">
                                {element}:
                              </p>
                              <ul className="list-disc list-inside space-y-1 ml-2">
                                {Array.isArray(states) &&
                                  states.map((state: string, index: number) => (
                                    <li key={index} className="text-sm">
                                      {state}
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {journal.stepData.step4Contradiction && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      Bước 4: Phát biểu mâu thuẫn
                    </h3>
                    <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                      {journal.stepData.step4Contradiction
                        .physicalContradictions &&
                        journal.stepData.step4Contradiction
                          .physicalContradictions.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-muted-foreground">
                              Mâu thuẫn Vật lý (ML):
                            </p>
                            {journal.stepData.step4Contradiction.physicalContradictions.map(
                              (pc: PhysicalContradiction, index: number) => (
                                <div
                                  key={index}
                                  className="p-3 rounded-lg bg-background"
                                >
                                  <p className="text-xs font-semibold text-primary mb-1">
                                    {pc.element}
                                  </p>
                                  <p className="text-sm">
                                    {pc.contradictionStatement}
                                  </p>
                                </div>
                              ),
                            )}
                          </div>
                        )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {journal.stepData.step5Ideas && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      Bước 5: Phát các ý tưởng giải quyết ML
                    </h3>
                    <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                      {journal.stepData.step5Ideas.selectedIdeas &&
                      journal.stepData.step5Ideas.selectedIdeas.length > 0 ? (
                        <>
                          <p className="text-xs font-medium text-muted-foreground">
                            Các ý tưởng được chọn:
                          </p>
                          {journal.stepData.step5Ideas.selectedIdeas.map(
                            (
                              idea: {
                                id: number;
                                ideaStatement: string;
                                principleUsed?: {
                                  id: number;
                                  name: string;
                                  priority?: number;
                                };
                                howItAddresses?: string;
                              },
                              index: number,
                            ) => (
                              <div key={index} className="space-y-2">
                                <div className="flex items-start gap-2">
                                  <span className="text-xs font-semibold text-primary mt-0.5">
                                    #{index + 1}
                                  </span>
                                  <div className="flex-1 space-y-1">
                                    {idea.principleUsed && (
                                      <p className="text-xs font-medium text-muted-foreground">
                                        Nguyên tắc #{idea.principleUsed.id}:{' '}
                                        {idea.principleUsed.name}
                                        {idea.principleUsed.priority &&
                                          ` (Độ ưu tiên: ${idea.principleUsed.priority})`}
                                      </p>
                                    )}
                                    <p className="text-sm">
                                      {idea.ideaStatement}
                                    </p>
                                    {idea.howItAddresses && (
                                      <p className="text-xs text-muted-foreground italic">
                                        {idea.howItAddresses}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                {index <
                                  journal.stepData.step5Ideas!.selectedIdeas!
                                    .length -
                                    1 && <div className="border-t" />}
                              </div>
                            ),
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Chưa chọn ý tưởng nào.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {journal.stepData.step6Decision && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      Bước 6: Ra quyết định
                    </h3>
                    <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                      {journal.stepData.step6Decision.evaluatedIdeas &&
                      journal.stepData.step6Decision.evaluatedIdeas.length >
                        0 ? (
                        journal.stepData.step6Decision.evaluatedIdeas.map(
                          (
                            evaluation: {
                              ideaStatement?: string;
                              aiComment?: string;
                              userRating?: number;
                              userComment?: string;
                            },
                            index: number,
                          ) => (
                            <div
                              key={index}
                              className="p-3 rounded-lg bg-primary/10 border border-primary"
                            >
                              <div className="space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="text-xs font-semibold text-primary">
                                    Ý tưởng #{index + 1}
                                  </p>
                                </div>
                                {evaluation.ideaStatement && (
                                  <p className="text-sm">
                                    {evaluation.ideaStatement}
                                  </p>
                                )}

                                {evaluation.aiComment && (
                                  <div className="pt-2 border-t space-y-2">
                                    <div>
                                      <p className="text-xs font-medium mb-1">
                                        Đánh giá AI:
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {evaluation.aiComment}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {/* User feedback */}
                                {(evaluation.userRating ||
                                  evaluation.userComment) && (
                                  <div className="pt-2 border-t">
                                    <p className="text-xs font-medium mb-1">
                                      Đánh giá của bạn:
                                    </p>
                                    {evaluation.userRating && (
                                      <div className="flex items-center gap-1 mb-1">
                                        {[...Array(5)].map((_, i) => (
                                          <Star
                                            key={i}
                                            className={`h-3 w-3 ${
                                              i < (evaluation.userRating ?? 0)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                            }`}
                                          />
                                        ))}
                                        <span className="text-xs text-muted-foreground ml-1">
                                          ({evaluation.userRating}/5)
                                        </span>
                                      </div>
                                    )}
                                    {evaluation.userComment && (
                                      <p className="text-xs text-muted-foreground italic">
                                        &ldquo;{evaluation.userComment}&rdquo;
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          ),
                        )
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Chưa có đánh giá nào.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {Object.keys(journal.stepData).length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">
                      Chưa có dữ liệu
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Nhật ký này chưa có bước nào được hoàn thành
                    </p>
                    <Button asChild>
                      <Link to="/6-steps" search={{ problemId: journal.id }}>
                        Bắt đầu giải quyết
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default JournalDetailPage;
