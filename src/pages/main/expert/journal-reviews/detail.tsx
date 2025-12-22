import { useNavigate, useParams } from '@tanstack/react-router';
import {
  ArrowLeft,
  Check,
  MessageSquare,
  Minus,
  Plus,
  Star,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useGetJournalByIdQuery } from '@/features/6-steps/services/queries';
import useAuth from '@/features/auth/hooks/use-auth';
import { Role } from '@/features/auth/types';
import { NestedReviews } from '@/features/journal-review/components/nested-reviews';
import { ReviewItem } from '@/features/journal-review/components/review-item';
import {
  useCreateChildReviewMutation,
  useDeleteReviewMutation,
  usePatchReviewMutation,
} from '@/features/journal-review/services/mutations';
import {
  useGetReviewByIdQuery,
  useSearchChildReviewsQuery,
} from '@/features/journal-review/services/queries';
import { getReviewStatusBadge } from '@/features/journal-review/utils/status';
import { ExpertLayout } from '@/layouts/expert-layout';
import { formatDate } from '@/utils';

import type { PhysicalContradiction } from '@/features/6-steps/types';
import type { ReviewStatus } from '@/features/journal-review/types';

const DATE_FORMAT = 'DD/MM/YYYY HH:mm' as const;

const ExpertJournalReviewDetailPage = () => {
  const { problemId, creatorId, journalReviewId } = useParams({
    from: '/expert/journal-reviews/$problemId/$creatorId/$journalReviewId',
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch journal data
  const { data: journal, isLoading: journalLoading } = useGetJournalByIdQuery(
    creatorId,
    problemId,
  );

  // Fetch root review data
  const { data: rootReview, isLoading: rootReviewLoading } =
    useGetReviewByIdQuery(creatorId, journalReviewId);

  // Fetch general reviews (stepNumber: null)
  const [generalPagination] = useState({ pageIndex: 0, pageSize: 50 });
  const [generalSorting] = useState([{ id: 'createdAt', desc: false }]);
  const { data: generalReviewsData, isLoading: generalLoading } =
    useSearchChildReviewsQuery(
      journalReviewId,
      { stepNumber: null },
      generalPagination,
      generalSorting,
    );

  const generalReviews = useMemo(
    () => generalReviewsData?.content || [],
    [generalReviewsData],
  );

  // Fetch step-based reviews for each step
  const [stepPagination] = useState({ pageIndex: 0, pageSize: 50 });
  const [stepSorting] = useState([{ id: 'createdAt', desc: false }]);

  const { data: step1Reviews } = useSearchChildReviewsQuery(
    journalReviewId,
    { stepNumber: 1 },
    stepPagination,
    stepSorting,
  );
  const { data: step2Reviews } = useSearchChildReviewsQuery(
    journalReviewId,
    { stepNumber: 2 },
    stepPagination,
    stepSorting,
  );
  const { data: step3Reviews } = useSearchChildReviewsQuery(
    journalReviewId,
    { stepNumber: 3 },
    stepPagination,
    stepSorting,
  );
  const { data: step4Reviews } = useSearchChildReviewsQuery(
    journalReviewId,
    { stepNumber: 4 },
    stepPagination,
    stepSorting,
  );
  const { data: step5Reviews } = useSearchChildReviewsQuery(
    journalReviewId,
    { stepNumber: 5 },
    stepPagination,
    stepSorting,
  );
  const { data: step6Reviews } = useSearchChildReviewsQuery(
    journalReviewId,
    { stepNumber: 6 },
    stepPagination,
    stepSorting,
  );

  // Mutations
  const createChildReviewMutation = useCreateChildReviewMutation();
  const patchReviewMutation = usePatchReviewMutation();
  const deleteReviewMutation = useDeleteReviewMutation();

  // Local state for comment input
  const [generalComment, setGeneralComment] = useState('');
  const [stepComments, setStepComments] = useState<Record<number, string>>({});
  const [stepRatings, setStepRatings] = useState<Record<number, number>>({});
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editRating, setEditRating] = useState<number | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>(
    {},
  );

  const isExpertOrAdmin =
    user?.roles?.includes(Role.EXPERT) || user?.roles?.includes(Role.ADMIN);
  const isOwner = user?.id === creatorId;
  const isAdmin = user?.roles?.includes(Role.ADMIN);

  const canChangeStatus = isExpertOrAdmin;
  const canDelete = (reviewOwnerId: string) => {
    return isAdmin || reviewOwnerId === user?.id;
  };

  const isReadOnly = rootReview?.status === 'APPROVED';

  // Handle create child review
  const handleCreateChildReview = (
    parentReviewId: string,
    stepNumber: number | null,
    content: string,
    rating?: number,
  ) => {
    if (!content.trim()) {
      toast.error('Vui lòng nhập nội dung');
      return;
    }

    createChildReviewMutation.mutateAsync(
      {
        problemReviewId: parentReviewId,
        content: content.trim(),
        stepNumber: stepNumber === null ? undefined : stepNumber,
        rating: rating || undefined,
        creatorId,
        currentStatus: rootReview?.status,
      },
      {
        onSuccess: () => {
          toast.success('Thêm đánh giá thành công');

          // Clear input
          if (stepNumber === null) {
            setGeneralComment('');
          } else {
            setStepComments((prev) => ({ ...prev, [stepNumber]: '' }));
            setStepRatings((prev) => ({ ...prev, [stepNumber]: 0 }));
          }
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || 'Có lỗi xảy ra');
        },
      },
    );
  };

  // Handle update review
  const handleUpdateReview = async (
    reviewId: string,
    stepNumber: number | null,
  ) => {
    if (!editContent.trim()) {
      toast.error('Vui lòng nhập nội dung');
      return;
    }

    try {
      await patchReviewMutation.mutateAsync({
        userId: user!.id,
        problemReviewId: reviewId,
        rootReviewId: journalReviewId,
        content: editContent.trim(),
        rating: editRating === null ? undefined : editRating,
        stepNumber: stepNumber,
      });
      toast.success('Cập nhật thành công');
      setEditingReview(null);
      setEditContent('');
      setEditRating(null);
    } catch {
      toast.error('Có lỗi xảy ra');
    }
  };

  // Handle delete review
  const handleDeleteReview = async (
    reviewId: string,
    stepNumber: number | null,
  ) => {
    try {
      await deleteReviewMutation.mutateAsync({
        userId: user!.id,
        problemReviewId: reviewId,
        rootReviewId: journalReviewId,
        stepNumber: stepNumber,
      });
      toast.success('Xóa thành công');
    } catch {
      toast.error('Có lỗi xảy ra');
    }
  };

  // Handle change root review status
  const handleChangeStatus = async (newStatus: ReviewStatus) => {
    if (!rootReview) return;

    try {
      await patchReviewMutation.mutateAsync({
        userId: creatorId,
        problemReviewId: journalReviewId,
        rootReviewId: journalReviewId,
        status: newStatus,
      });
      toast.success('Cập nhật trạng thái thành công');
    } catch {
      toast.error('Có lỗi xảy ra');
    }
  };

  if (journalLoading || rootReviewLoading) {
    return (
      <ExpertLayout meta={{ title: 'Đang tải...' }}>
        <div className="p-8 space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </ExpertLayout>
    );
  }

  if (!journal || !rootReview) {
    return (
      <ExpertLayout meta={{ title: 'Không tìm thấy' }}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <MessageSquare className="h-16 w-16 text-muted-foreground opacity-50" />
          <h2 className="text-2xl font-bold">Không tìm thấy đánh giá</h2>
          <Button onClick={() => navigate({ to: '/expert/journal-reviews' })}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </div>
      </ExpertLayout>
    );
  }

  return (
    <ExpertLayout meta={{ title: 'Chi tiết Đánh giá Nhật ký' }}>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={() => navigate({ to: '/expert/journal-reviews' })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Button>

          <div className="flex flex-col">
            <h1 className="text-3xl font-bold">{journal.title}</h1>
            <div className="flex items-center justify-between gap-3 mt-2">
              <div>
                <p className="text-muted-foreground">
                  Người yêu cầu: {rootReview.creatorFullName}
                </p>
                <p className="text-sm text-muted-foreground">
                  Ngày tạo:{' '}
                  {formatDate(new Date(rootReview.createdAt), DATE_FORMAT)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getReviewStatusBadge(rootReview.status, 'md')}
                {!isReadOnly &&
                  canChangeStatus &&
                  rootReview.status === 'PROCESSING' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleChangeStatus('REVIEWED')}
                    >
                      Đánh dấu Đã đánh giá
                    </Button>
                  )}
                {!isReadOnly && isOwner && rootReview.status === 'REVIEWED' && (
                  <Button
                    variant="default"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleChangeStatus('APPROVED')}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Kết thúc đánh giá
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Root Review Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nội dung yêu cầu</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{rootReview.content}</p>
              {rootReview.averageRating && (
                <div className="flex items-center gap-1 mt-4">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">
                    Đánh giá trung bình: {rootReview.averageRating.toFixed(1)}/5
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Main Content - Journal 6 Steps */}
          <div className="space-y-6">
            {/* Step 1 */}
            {journal.stepData.step1Understand && (
              <Card id="step-1">
                <CardHeader>
                  <CardTitle>Bước 1: Hiểu vấn đề</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Vấn đề ban đầu:</h4>
                    <p>{journal.stepData.step1Understand.rawProblem}</p>
                  </div>
                  {journal.stepData.step1Understand.selectedMiniProblem && (
                    <div>
                      <h4 className="font-semibold">Vấn đề nhỏ đã chọn:</h4>
                      <p className="italic">
                        {journal.stepData.step1Understand.selectedMiniProblem}
                      </p>
                    </div>
                  )}

                  {/* Step-based reviews */}
                  {step1Reviews?.content && step1Reviews.content.length > 0 && (
                    <div className="mt-6 pt-4 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setExpandedSteps((prev) => ({
                            ...prev,
                            1: !prev[1],
                          }))
                        }
                        className="flex items-center gap-2 mb-3"
                      >
                        {expandedSteps[1] ? (
                          <Minus className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                        <span className="font-medium">
                          Đánh giá ({step1Reviews.content.length})
                        </span>
                      </Button>
                      {expandedSteps[1] && (
                        <NestedReviews
                          reviews={step1Reviews.content}
                          isReadOnly={isReadOnly}
                          userId={user?.id}
                          canDelete={canDelete}
                          canRate={isExpertOrAdmin}
                          editingReview={editingReview}
                          editContent={editContent}
                          editRating={editRating}
                          setEditingReview={setEditingReview}
                          setEditContent={setEditContent}
                          setEditRating={setEditRating}
                          handleUpdateReview={handleUpdateReview}
                          handleDeleteReview={handleDeleteReview}
                        />
                      )}
                    </div>
                  )}

                  {/* Add review for step 1 */}
                  {!isReadOnly && isExpertOrAdmin && (
                    <div className="space-y-2 pt-4 border-t">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">
                            Đánh giá bước 1
                          </label>
                          <span className="text-xs text-gray-400">
                            {(stepComments[1] || '').length}/2000
                          </span>
                        </div>
                        <Textarea
                          placeholder="Đánh giá bước 1..."
                          value={stepComments[1] || ''}
                          onChange={(e) =>
                            setStepComments((prev) => ({
                              ...prev,
                              1: e.target.value,
                            }))
                          }
                          maxLength={2000}
                          className="min-h-[60px]"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Đánh giá:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 cursor-pointer ${
                              star <= (stepRatings[1] || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                            onClick={() =>
                              setStepRatings((prev) => ({
                                ...prev,
                                1: star,
                              }))
                            }
                          />
                        ))}
                      </div>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleCreateChildReview(
                            journalReviewId,
                            1,
                            stepComments[1] || '',
                            stepRatings[1],
                          )
                        }
                        disabled={!stepComments[1]?.trim()}
                      >
                        Gửi đánh giá
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 2 */}
            {journal.stepData.step2Objectives && (
              <Card id="step-2">
                <CardHeader>
                  <CardTitle>Bước 2: Đề ra mục đích cần đạt</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Mục tiêu:</h4>
                    <p>{journal.stepData.step2Objectives.goal}</p>
                  </div>

                  {/* Step-based reviews */}
                  {step2Reviews?.content && step2Reviews.content.length > 0 && (
                    <div className="mt-6 pt-4 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setExpandedSteps((prev) => ({
                            ...prev,
                            2: !prev[2],
                          }))
                        }
                        className="flex items-center gap-2 mb-3"
                      >
                        {expandedSteps[2] ? (
                          <Minus className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                        <span className="font-medium">
                          Đánh giá ({step2Reviews.content.length})
                        </span>
                      </Button>
                      {expandedSteps[2] && (
                        <NestedReviews
                          reviews={step2Reviews.content}
                          isReadOnly={isReadOnly}
                          userId={user?.id}
                          canDelete={canDelete}
                          canRate={isExpertOrAdmin}
                          editingReview={editingReview}
                          editContent={editContent}
                          editRating={editRating}
                          setEditingReview={setEditingReview}
                          setEditContent={setEditContent}
                          setEditRating={setEditRating}
                          handleUpdateReview={handleUpdateReview}
                          handleDeleteReview={handleDeleteReview}
                        />
                      )}
                    </div>
                  )}

                  {/* Add review for step 2 */}
                  {!isReadOnly && isExpertOrAdmin && (
                    <div className="space-y-2 pt-4 border-t">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">
                            Đánh giá bước 2
                          </label>
                          <span className="text-xs text-gray-400">
                            {(stepComments[2] || '').length}/2000
                          </span>
                        </div>
                        <Textarea
                          placeholder="Đánh giá bước 2..."
                          value={stepComments[2] || ''}
                          onChange={(e) =>
                            setStepComments((prev) => ({
                              ...prev,
                              2: e.target.value,
                            }))
                          }
                          maxLength={2000}
                          className="min-h-[60px]"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Đánh giá:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 cursor-pointer ${
                              star <= (stepRatings[2] || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                            onClick={() =>
                              setStepRatings((prev) => ({
                                ...prev,
                                2: star,
                              }))
                            }
                          />
                        ))}
                      </div>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleCreateChildReview(
                            journalReviewId,
                            2,
                            stepComments[2] || '',
                            stepRatings[2],
                          )
                        }
                        disabled={!stepComments[2]?.trim()}
                      >
                        Gửi đánh giá
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 3 */}
            {journal.stepData.step3Analysis && (
              <Card id="step-3">
                <CardHeader>
                  <CardTitle>Bước 3: Phân tích hệ thống</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Hệ thống xác định:</h4>
                    <p>{journal.stepData.step3Analysis.systemIdentified}</p>
                  </div>
                  {journal.stepData.step3Analysis.elements?.length > 0 && (
                    <div>
                      <h4 className="font-semibold">Các yếu tố:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {journal.stepData.step3Analysis.elements.map(
                          (element: string, idx: number) => (
                            <li key={idx}>{element}</li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Step-based reviews */}
                  {step3Reviews?.content && step3Reviews.content.length > 0 && (
                    <div className="mt-6 pt-4 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setExpandedSteps((prev) => ({
                            ...prev,
                            3: !prev[3],
                          }))
                        }
                        className="flex items-center gap-2 mb-3"
                      >
                        {expandedSteps[3] ? (
                          <Minus className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                        <span className="font-medium">
                          Đánh giá ({step3Reviews.content.length})
                        </span>
                      </Button>
                      {expandedSteps[3] && (
                        <NestedReviews
                          reviews={step3Reviews.content}
                          isReadOnly={isReadOnly}
                          userId={user?.id}
                          canDelete={canDelete}
                          canRate={isExpertOrAdmin}
                          editingReview={editingReview}
                          editContent={editContent}
                          editRating={editRating}
                          setEditingReview={setEditingReview}
                          setEditContent={setEditContent}
                          setEditRating={setEditRating}
                          handleUpdateReview={handleUpdateReview}
                          handleDeleteReview={handleDeleteReview}
                        />
                      )}
                    </div>
                  )}

                  {/* Add review for step 3 */}
                  {!isReadOnly && isExpertOrAdmin && (
                    <div className="space-y-2 pt-4 border-t">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">
                            Đánh giá bước 3
                          </label>
                          <span className="text-xs text-gray-400">
                            {(stepComments[3] || '').length}/2000
                          </span>
                        </div>
                        <Textarea
                          placeholder="Đánh giá bước 3..."
                          value={stepComments[3] || ''}
                          onChange={(e) =>
                            setStepComments((prev) => ({
                              ...prev,
                              3: e.target.value,
                            }))
                          }
                          maxLength={2000}
                          className="min-h-[60px]"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Đánh giá:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 cursor-pointer ${
                              star <= (stepRatings[3] || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                            onClick={() =>
                              setStepRatings((prev) => ({
                                ...prev,
                                3: star,
                              }))
                            }
                          />
                        ))}
                      </div>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleCreateChildReview(
                            journalReviewId,
                            3,
                            stepComments[3] || '',
                            stepRatings[3],
                          )
                        }
                        disabled={!stepComments[3]?.trim()}
                      >
                        Gửi đánh giá
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 4 */}
            {journal.stepData.step4Contradiction && (
              <Card id="step-4">
                <CardHeader>
                  <CardTitle>Bước 4: Phát biểu mâu thuẫn</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {journal.stepData.step4Contradiction.physicalContradictions
                    ?.length > 0 && (
                    <div>
                      <h4 className="font-semibold">Mâu thuẫn vật lý:</h4>
                      <div className="space-y-3 mt-2">
                        {journal.stepData.step4Contradiction.physicalContradictions.map(
                          (pc: PhysicalContradiction, index: number) => (
                            <div key={index} className="p-3 border rounded-lg">
                              <p className="font-medium">{pc.element}</p>
                              <p className="text-sm text-muted-foreground">
                                {pc.contradictionStatement}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step-based reviews */}
                  {step4Reviews?.content && step4Reviews.content.length > 0 && (
                    <div className="mt-6 pt-4 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setExpandedSteps((prev) => ({
                            ...prev,
                            4: !prev[4],
                          }))
                        }
                        className="flex items-center gap-2 mb-3"
                      >
                        {expandedSteps[4] ? (
                          <Minus className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                        <span className="font-medium">
                          Đánh giá ({step4Reviews.content.length})
                        </span>
                      </Button>
                      {expandedSteps[4] && (
                        <NestedReviews
                          reviews={step4Reviews.content}
                          isReadOnly={isReadOnly}
                          userId={user?.id}
                          canDelete={canDelete}
                          canRate={isExpertOrAdmin}
                          editingReview={editingReview}
                          editContent={editContent}
                          editRating={editRating}
                          setEditingReview={setEditingReview}
                          setEditContent={setEditContent}
                          setEditRating={setEditRating}
                          handleUpdateReview={handleUpdateReview}
                          handleDeleteReview={handleDeleteReview}
                        />
                      )}
                    </div>
                  )}

                  {/* Add review for step 4 */}
                  {!isReadOnly && isExpertOrAdmin && (
                    <div className="space-y-2 pt-4 border-t">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">
                            Đánh giá bước 4
                          </label>
                          <span className="text-xs text-gray-400">
                            {(stepComments[4] || '').length}/2000
                          </span>
                        </div>
                        <Textarea
                          placeholder="Đánh giá bước 4..."
                          value={stepComments[4] || ''}
                          onChange={(e) =>
                            setStepComments((prev) => ({
                              ...prev,
                              4: e.target.value,
                            }))
                          }
                          maxLength={2000}
                          className="min-h-[60px]"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Đánh giá:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 cursor-pointer ${
                              star <= (stepRatings[4] || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                            onClick={() =>
                              setStepRatings((prev) => ({
                                ...prev,
                                4: star,
                              }))
                            }
                          />
                        ))}
                      </div>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleCreateChildReview(
                            journalReviewId,
                            4,
                            stepComments[4] || '',
                            stepRatings[4],
                          )
                        }
                        disabled={!stepComments[4]?.trim()}
                      >
                        Gửi đánh giá
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 5 */}
            {journal.stepData.step5Ideas && (
              <Card id="step-5">
                <CardHeader>
                  <CardTitle>Bước 5: Ý tưởng giải quyết</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {journal.stepData.step5Ideas.selectedIdeas?.length > 0 && (
                    <ol className="space-y-3 list-decimal list-inside">
                      {journal.stepData.step5Ideas.selectedIdeas.map(
                        (
                          idea: {
                            ideaStatement: string;
                            principleUsed?: { id: number; name: string };
                          },
                          index: number,
                        ) => (
                          <li key={index} className="p-3 border rounded-lg">
                            {idea.principleUsed && (
                              <p className="text-sm font-semibold text-blue-600">
                                Nguyên tắc #{idea.principleUsed.id}:{' '}
                                {idea.principleUsed.name}
                              </p>
                            )}
                            <p className="mt-1">{idea.ideaStatement}</p>
                          </li>
                        ),
                      )}
                    </ol>
                  )}

                  {/* Step-based reviews */}
                  {step5Reviews?.content && step5Reviews.content.length > 0 && (
                    <div className="mt-6 pt-4 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setExpandedSteps((prev) => ({
                            ...prev,
                            5: !prev[5],
                          }))
                        }
                        className="flex items-center gap-2 mb-3"
                      >
                        {expandedSteps[5] ? (
                          <Minus className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                        <span className="font-medium">
                          Đánh giá ({step5Reviews.content.length})
                        </span>
                      </Button>
                      {expandedSteps[5] && (
                        <NestedReviews
                          reviews={step5Reviews.content}
                          isReadOnly={isReadOnly}
                          userId={user?.id}
                          canDelete={canDelete}
                          canRate={isExpertOrAdmin}
                          editingReview={editingReview}
                          editContent={editContent}
                          editRating={editRating}
                          setEditingReview={setEditingReview}
                          setEditContent={setEditContent}
                          setEditRating={setEditRating}
                          handleUpdateReview={handleUpdateReview}
                          handleDeleteReview={handleDeleteReview}
                        />
                      )}
                    </div>
                  )}

                  {/* Add review for step 5 */}
                  {!isReadOnly && isExpertOrAdmin && (
                    <div className="space-y-2 pt-4 border-t">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">
                            Đánh giá bước 5
                          </label>
                          <span className="text-xs text-gray-400">
                            {(stepComments[5] || '').length}/2000
                          </span>
                        </div>
                        <Textarea
                          placeholder="Đánh giá bước 5..."
                          value={stepComments[5] || ''}
                          onChange={(e) =>
                            setStepComments((prev) => ({
                              ...prev,
                              5: e.target.value,
                            }))
                          }
                          maxLength={2000}
                          className="min-h-[60px]"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Đánh giá:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 cursor-pointer ${
                              star <= (stepRatings[5] || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                            onClick={() =>
                              setStepRatings((prev) => ({
                                ...prev,
                                5: star,
                              }))
                            }
                          />
                        ))}
                      </div>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleCreateChildReview(
                            journalReviewId,
                            5,
                            stepComments[5] || '',
                            stepRatings[5],
                          )
                        }
                        disabled={!stepComments[5]?.trim()}
                      >
                        Gửi đánh giá
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 6 */}
            {journal.stepData.step6Decision && (
              <Card id="step-6">
                <CardHeader>
                  <CardTitle>Bước 6: Quyết định</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {journal.stepData.step6Decision.evaluatedIdeas?.length >
                    0 && (
                    <div className="space-y-3">
                      {journal.stepData.step6Decision.evaluatedIdeas.map(
                        (
                          evaluation: {
                            ideaStatement?: string;
                            userRating?: number;
                            userComment?: string;
                          },
                          index: number,
                        ) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <p className="font-medium">
                              Ý tưởng {index + 1}: {evaluation.ideaStatement}
                            </p>
                            {evaluation.userRating && (
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm">
                                  {evaluation.userRating}/5
                                </span>
                              </div>
                            )}
                            {evaluation.userComment && (
                              <p className="text-sm text-muted-foreground mt-2 italic">
                                &quot;{evaluation.userComment}&quot;
                              </p>
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  )}

                  {/* Step-based reviews */}
                  {step6Reviews?.content && step6Reviews.content.length > 0 && (
                    <div className="mt-6 pt-4 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setExpandedSteps((prev) => ({
                            ...prev,
                            6: !prev[6],
                          }))
                        }
                        className="flex items-center gap-2 mb-3"
                      >
                        {expandedSteps[6] ? (
                          <Minus className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                        <span className="font-medium">
                          Đánh giá ({step6Reviews.content.length})
                        </span>
                      </Button>
                      {expandedSteps[6] && (
                        <NestedReviews
                          reviews={step6Reviews.content}
                          isReadOnly={isReadOnly}
                          userId={user?.id}
                          canDelete={canDelete}
                          canRate={isExpertOrAdmin}
                          editingReview={editingReview}
                          editContent={editContent}
                          editRating={editRating}
                          setEditingReview={setEditingReview}
                          setEditContent={setEditContent}
                          setEditRating={setEditRating}
                          handleUpdateReview={handleUpdateReview}
                          handleDeleteReview={handleDeleteReview}
                        />
                      )}
                    </div>
                  )}

                  {/* Add review for step 6 */}
                  {!isReadOnly && isExpertOrAdmin && (
                    <div className="space-y-2 pt-4 border-t">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">
                            Đánh giá bước 6
                          </label>
                          <span className="text-xs text-gray-400">
                            {(stepComments[6] || '').length}/2000
                          </span>
                        </div>
                        <Textarea
                          placeholder="Đánh giá bước 6..."
                          value={stepComments[6] || ''}
                          onChange={(e) =>
                            setStepComments((prev) => ({
                              ...prev,
                              6: e.target.value,
                            }))
                          }
                          maxLength={2000}
                          className="min-h-[60px]"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Đánh giá:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 cursor-pointer ${
                              star <= (stepRatings[6] || 0)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                            onClick={() =>
                              setStepRatings((prev) => ({
                                ...prev,
                                6: star,
                              }))
                            }
                          />
                        ))}
                      </div>
                      <Button
                        size="sm"
                        onClick={() =>
                          handleCreateChildReview(
                            journalReviewId,
                            6,
                            stepComments[6] || '',
                            stepRatings[6],
                          )
                        }
                        disabled={!stepComments[6]?.trim()}
                      >
                        Gửi đánh giá
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* General Reviews Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Đánh giá chung ({generalReviews.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {generalLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : generalReviews.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Chưa có đánh giá chung
                  </p>
                ) : (
                  <div className="space-y-3">
                    {generalReviews.map((review) => (
                      <ReviewItem
                        key={review.id}
                        review={review}
                        canEdit={review.creatorId === user?.id}
                        canDelete={canDelete(review.creatorId)}
                        isEditing={editingReview === review.id}
                        editContent={editContent}
                        editRating={editRating}
                        isReadOnly={isReadOnly}
                        onEdit={(
                          id: string,
                          content: string,
                          rating: number | null,
                        ) => {
                          setEditingReview(id);
                          setEditContent(content);
                          setEditRating(rating);
                        }}
                        onStartEdit={(
                          id: string,
                          content: string,
                          rating: number | null,
                        ) => {
                          setEditingReview(id);
                          setEditContent(content);
                          setEditRating(rating);
                        }}
                        onCancelEdit={() => {
                          setEditingReview(null);
                          setEditContent('');
                          setEditRating(null);
                        }}
                        onUpdateReview={() =>
                          handleUpdateReview(review.id, review.stepNumber)
                        }
                        onDelete={() =>
                          handleDeleteReview(review.id, review.stepNumber)
                        }
                        setEditContent={setEditContent}
                        setEditRating={setEditRating}
                      />
                    ))}
                  </div>
                )}

                {/* Add general comment */}
                {!isReadOnly && (
                  <div className="pt-4 border-t">
                    <div className="space-y-2 mb-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">
                          Đánh giá chung
                        </label>
                        <span className="text-xs text-gray-400">
                          {generalComment.length}/2000
                        </span>
                      </div>
                      <Textarea
                        placeholder="Thêm đánh giá chung..."
                        value={generalComment}
                        onChange={(e) => setGeneralComment(e.target.value)}
                        maxLength={2000}
                      />
                    </div>
                    <Button
                      onClick={() =>
                        handleCreateChildReview(
                          journalReviewId,
                          null,
                          generalComment,
                        )
                      }
                      disabled={!generalComment.trim()}
                    >
                      Gửi đánh giá
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ExpertLayout>
  );
};

export default ExpertJournalReviewDetailPage;
