import { zodResolver } from '@hookform/resolvers/zod';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import type { IdeaAssessmentRequest } from '@/features/6-steps/services/queries/types';

const reviewSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED'], {
    required_error: 'Vui lòng chọn trạng thái',
  }),
  expertRating: z.coerce
    .number()
    .min(1, 'Đánh giá tối thiểu là 1')
    .max(5, 'Đánh giá tối đa là 5'),
  expertComment: z.string().min(10, 'Nhận xét cần ít nhất 10 ký tự'),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface IdeaAssessmentReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: IdeaAssessmentRequest;
}

export const IdeaAssessmentReviewDialog = ({
  open,
  onOpenChange,
  request,
}: IdeaAssessmentReviewDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      status: request.status === 'APPROVED' ? 'APPROVED' : undefined,
      expertRating: request.expertRating || undefined,
      expertComment: request.expertComment || '',
    },
  });

  const onSubmit = async (data: ReviewFormValues) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement API call when backend is ready
      // eslint-disable-next-line no-console
      console.log('Submitting review:', {
        requestId: request.id,
        ...data,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Đánh giá đã được lưu thành công');
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Failed to submit review:', error);
      toast.error('Có lỗi xảy ra khi lưu đánh giá');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Đánh giá Ý tưởng</DialogTitle>
          <DialogDescription>
            Đánh giá ý tưởng từ người dùng {request.userFullName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Idea Information */}
          <div className="rounded-lg border p-4 space-y-3 bg-muted/50">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Nhật ký
              </h4>
              <p className="text-sm mt-1">{request.journalTitle}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Ý tưởng
              </h4>
              <p className="text-sm mt-1">{request.ideaStatement}</p>
            </div>

            {request.principleUsed && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Nguyên tắc TRIZ
                </h4>
                <p className="text-sm mt-1">
                  #{request.principleUsed.id} - {request.principleUsed.name}
                </p>
              </div>
            )}

            {request.howItAddresses && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Cách giải quyết
                </h4>
                <p className="text-sm mt-1">{request.howItAddresses}</p>
              </div>
            )}
          </div>

          {/* Review Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trạng thái đánh giá</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn trạng thái" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="APPROVED">Chấp thuận</SelectItem>
                        <SelectItem value="REJECTED">Từ chối</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Quyết định của bạn về ý tưởng này
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expertRating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Đánh giá (1-5 sao)</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value?.toString()}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Chọn" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <SelectItem
                                key={rating}
                                value={rating.toString()}
                              >
                                <div className="flex items-center gap-2">
                                  {rating}
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {field.value && (
                          <div className="flex items-center gap-1">
                            {Array.from({ length: field.value }).map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Đánh giá chất lượng của ý tưởng
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expertComment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nhận xét của chuyên gia</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập nhận xét chi tiết về ý tưởng..."
                        className="min-h-32 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Cung cấp phản hồi chi tiết để giúp người dùng cải thiện
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Đang lưu...' : 'Lưu đánh giá'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
