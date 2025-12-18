import { Plus } from 'lucide-react';
import React, { useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NumberInput } from '@/components/ui/number-input';
import { Textarea } from '@/components/ui/textarea';
import {
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
} from '@/features/assignment/services/mutations';
import { useGetAssignmentByIdQuery } from '@/features/assignment/services/queries';

type AddAssignmentModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleId: string;
  assignmentId?: string;
  onSaved?: () => void;
  viewMode?: boolean;
};

export const AddAssignmentModal: React.FC<AddAssignmentModalProps> = ({
  open,
  onOpenChange,
  moduleId,
  assignmentId,
  onSaved,
  viewMode = false,
}) => {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [durationInMinutes, setDurationInMinutes] = React.useState<
    number | undefined
  >(60);
  const [maxAttempts, setMaxAttempts] = React.useState<number | undefined>(3);
  const [criteria, setCriteria] = React.useState<string[]>(['']);

  const createAssignment = useCreateAssignmentMutation(moduleId);
  const updateAssignment = useUpdateAssignmentMutation(assignmentId || '');
  const assignmentQuery = useGetAssignmentByIdQuery(assignmentId);

  const isSubmitting = createAssignment.isPending || updateAssignment.isPending;
  const isFetching = assignmentQuery.isFetching;
  const isDisabled = isFetching || isSubmitting || viewMode;

  // Load assignment data when editing
  useEffect(() => {
    if (!assignmentQuery.data) return;
    const data = assignmentQuery.data;

    setTitle(data.title ?? '');
    setDescription(data.description ?? '');
    setDurationInMinutes(data.durationInMinutes ?? 60);
    setMaxAttempts(data.maxAttempts ?? 3);
    setCriteria(data.criteria ?? []);
  }, [assignmentQuery.data]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error('Tiêu đề bài tập là bắt buộc');
      return;
    }

    if (!description.trim()) {
      toast.error('Mô tả bài tập là bắt buộc');
      return;
    }

    if (durationInMinutes === undefined || durationInMinutes <= 0) {
      toast.error('Thời lượng phải lớn hơn 0');
      return;
    }

    if (maxAttempts === undefined || maxAttempts <= 0) {
      toast.error('Số lần thử tối đa phải lớn hơn 0');
      return;
    }
    if (criteria.length === 0 || criteria.some((c) => !c.trim())) {
      toast.error('Phải có ít nhất một tiêu chí hợp lệ');
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      durationInMinutes,
      maxAttempts,
      criteria,
    };

    const mutation = assignmentId ? updateAssignment : createAssignment;
    const successMessage = assignmentId
      ? 'Cập nhật bài tập thành công'
      : 'Tạo bài tập thành công';

    try {
      mutation.mutate(payload, {
        onSuccess: () => {
          toast.success(successMessage);
          handleClose();
          onSaved?.();
        },
        onError: (error) => {
          let msg = assignmentId
            ? 'Tải cập nhật bài tập thất bại'
            : 'Tạo bài tập thất bại';
          if (error instanceof Error) msg = error.message;
          else if (typeof error === 'string') msg = error;
          toast.error(msg);
        },
      });
    } catch (error) {
      let msg = 'Lưu bài tập thất bại';
      if (error instanceof Error) msg = error.message;
      else if (typeof error === 'string') msg = error;
      toast.error(msg);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setDurationInMinutes(60);
    setMaxAttempts(3);
    setCriteria([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {viewMode
              ? 'Xem Bài Tập'
              : assignmentId
                ? 'Chỉnh sửa Bài Tập'
                : 'Thêm Bài Tập'}
          </DialogTitle>
          <DialogDescription>
            {viewMode
              ? 'Xem chi tiết bài tập.'
              : assignmentId
                ? 'Chỉnh sửa thông tin bài tập. Vui lòng cập nhật các trường cần thiết.'
                : 'Tạo bài tập mới cho chương này. Vui lòng điền tất cả các trường bắt buộc bên dưới.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label
              htmlFor="title"
              className="flex items-center justify-between"
            >
              <span>
                Tiêu đề{' '}
                {!viewMode && <span className="text-red-500">*</span>}{' '}
              </span>
              <span className="text-xs text-gray-400">
                {title.length}/200
              </span>{' '}
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề bài tập"
              required={!viewMode}
              disabled={isDisabled}
              readOnly={viewMode}
              maxLength={200}
              minLength={3}
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <div>
                <Label>
                  Tiêu chí{' '}
                  {!viewMode && <span className="text-red-500">*</span>}
                </Label>
              </div>
              {!viewMode && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCriteria([...criteria, ''])}
                  disabled={isDisabled}
                >
                  <Plus /> Thêm
                </Button>
              )}
            </div>

            <div className="space-y-2 overflow-y-auto max-h-40 p-2">
              {criteria.map((c, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    id={`criteria-${idx}`}
                    value={c}
                    onChange={(e) => {
                      const next = [...criteria];
                      next[idx] = e.target.value;
                      setCriteria(next);
                    }}
                    placeholder={`Nhập tiêu chí ${idx + 1}`}
                    disabled={isDisabled}
                    readOnly={viewMode}
                    maxLength={254}
                  />
                  {!viewMode && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setCriteria(criteria.filter((_, i) => i !== idx))
                      }
                      disabled={isDisabled}
                    >
                      X
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="description"
              className="flex items-center justify-between"
            >
              <span>
                Mô tả {!viewMode && <span className="text-red-500">*</span>}
              </span>
              <span className="text-xs text-gray-400">
                {description.length}/254
              </span>{' '}
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả bài tập"
              rows={4}
              required={!viewMode}
              disabled={isDisabled}
              readOnly={viewMode}
              maxLength={254}
              style={{ resize: 'none' }}
              className="h-40"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="duration">
                Thời lượng (phút){' '}
                {!viewMode && <span className="text-red-500">*</span>}
              </Label>
              <NumberInput
                id="duration"
                min={1}
                value={durationInMinutes}
                onValueChange={setDurationInMinutes}
                disabled={isDisabled}
                stepper={1}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="maxAttempts">
                Số lần thử tối đa{' '}
                {!viewMode && <span className="text-red-500">*</span>}
              </Label>
              <NumberInput
                id="maxAttempts"
                min={1}
                value={maxAttempts}
                onValueChange={setMaxAttempts}
                disabled={isDisabled}
                stepper={1}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isFetching || isSubmitting}
          >
            {viewMode ? 'Đóng' : 'Hủy'}
          </Button>
          {!viewMode && (
            <Button type="button" onClick={handleSubmit} disabled={isDisabled}>
              {isSubmitting
                ? assignmentId
                  ? 'Đang cập nhật...'
                  : 'Đang tạo...'
                : assignmentId
                  ? 'Cập nhật bài tập'
                  : 'Tạo bài tập'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
