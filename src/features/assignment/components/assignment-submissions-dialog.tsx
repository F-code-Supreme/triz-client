import { CheckCircle, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { MinimalTiptapEditor } from '@/components/ui/minimal-tiptap';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useExpertReviewAssignmentMutation } from '@/features/assignment/services/mutations';
import { useGetAssignmentByIdQueryExpert } from '@/features/assignment/services/queries';

interface AssignmentSubmissionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignmentId: string;
}

const AssignmentSubmissionsDialog = ({
  open,
  onOpenChange,
  assignmentId,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}: AssignmentSubmissionsDialogProps) => {
  const [passed, setPassed] = useState<boolean | null>(null);
  const [comment, setComment] = useState('');

  const { data: submission, isLoading } =
    useGetAssignmentByIdQueryExpert(assignmentId);
  const reviewMutation = useExpertReviewAssignmentMutation(assignmentId);

  useEffect(() => {
    if (submission) {
      if (submission.isExpertPassed !== null) {
        setPassed(submission.isExpertPassed);
      }
      if (submission.expertComment) {
        setComment(submission.expertComment);
      }
    }
  }, [submission, open]);

  const handleSubmit = () => {
    if (passed === null) {
      toast.error('Vui lòng chọn kết quả đánh giá');
      return;
    }

    reviewMutation.mutate(
      { passed, comment: comment.trim() || undefined },
      {
        onSuccess: () => {
          toast.success('Đánh giá thành công');
          onOpenChange(false);
          setPassed(null);
          setComment('');
        },
        onError: (error: unknown) => {
          toast.error(
            error instanceof Error ? error.message : 'Không thể gửi đánh giá',
          );
        },
      },
    );
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!reviewMutation.isPending) {
      onOpenChange(newOpen);
      if (!newOpen) {
        setPassed(null);
        setComment('');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết bài nộp</DialogTitle>
          <DialogDescription>Đánh giá bài nộp của học viên</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Đang tải...</div>
          </div>
        ) : submission ? (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Thông tin bài nộp</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Tiêu đề:</span>{' '}
                  {submission.title}
                </p>
                <p>
                  <span className="font-medium">Lần nộp thứ:</span>{' '}
                  {submission.attemptNumber}
                </p>
                <p>
                  <span className="font-medium">Trạng thái:</span>{' '}
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-md text-xs ${
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
                    }`}
                  >
                    {submission.status === 'EXPERT_PENDING'
                      ? 'Chờ chuyên gia đánh giá'
                      : submission.status === 'AI_PENDING'
                        ? 'Chờ AI đánh giá'
                        : submission.status === 'APPROVED'
                          ? 'Đã duyệt'
                          : submission.status === 'AI_REJECTED'
                            ? 'Bị từ chối bởi AI'
                            : submission.status === 'REJECTED'
                              ? 'Bị từ chối bởi chuyên gia'
                              : 'Không xác định'}
                  </span>
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Nội dung bài nộp</h3>
              <TooltipProvider>
                <MinimalTiptapEditor
                  key={submission.id}
                  value={submission.submissionContent}
                  showToolbar={false}
                  editable={false}
                />
              </TooltipProvider>
            </div>

            {submission.expertComment && (
              <div>
                <h3 className="font-semibold mb-2">Nhận xét trước đó</h3>
                <div className="border rounded-md p-4 bg-muted/30 text-sm">
                  {submission.expertComment}
                </div>
              </div>
            )}

            <div className="space-y-4 pt-4 border-t">
              <div>
                <Label className="text-base font-semibold">
                  Kết quả đánh giá
                </Label>
                <RadioGroup
                  value={passed === null ? '' : passed ? 'pass' : 'fail'}
                  onValueChange={(value) =>
                    setPassed(value === 'pass' ? true : false)
                  }
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="pass"
                      id="pass"
                      disabled={submission?.status !== 'EXPERT_PENDING'}
                    />
                    <Label
                      htmlFor="pass"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Đạt</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="fail"
                      id="fail"
                      disabled={submission?.status !== 'EXPERT_PENDING'}
                    />
                    <Label
                      htmlFor="fail"
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span>Không đạt</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="comment" className="text-base font-semibold">
                  Nhận xét
                </Label>
                <Textarea
                  disabled={submission?.status !== 'EXPERT_PENDING'}
                  id="comment"
                  placeholder="Nhập nhận xét của bạn về bài nộp..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Không tìm thấy bài nộp</div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={reviewMutation.isPending}
          >
            Hủy
          </Button>
          {submission?.status === 'EXPERT_PENDING' && (
            <Button
              onClick={handleSubmit}
              disabled={reviewMutation.isPending || !submission}
            >
              {reviewMutation.isPending ? 'Đang gửi...' : 'Gửi đánh giá'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentSubmissionsDialog;
