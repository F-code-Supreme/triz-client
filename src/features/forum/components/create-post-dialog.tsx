import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MinimalTiptapEditor } from '@/components/ui/minimal-tiptap';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { useCreateForumPostMutation } from '@/features/forum/services/mutations';
import { useUploadFileMutation } from '@/features/media/services/mutations';

type CreatePostDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
};

const stripHtml = (html: string) =>
  html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();

const CreatePostDialog = ({
  open,
  onOpenChange,
  onCreated,
}: CreatePostDialogProps) => {
  const [postTitle, setPostTitle] = useState('');
  const [postImage, setPostImage] = useState('');
  const [answer, setAnswer] = useState<string>('');
  const [titleError, setTitleError] = useState<string | null>(null);
  const [contentError, setContentError] = useState<string | null>(null);

  const uploadMutation = useUploadFileMutation();
  const createForumPostMutation = useCreateForumPostMutation();

  const handleClose = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo bài viết mới</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-2">
            <Label
              htmlFor="title"
              className="flex items-center justify-between"
            >
              <span>
                Tiêu đề <span className="text-red-500">*</span>
              </span>
              <span className="text-xs text-gray-400">
                {postTitle.length}/200
              </span>
            </Label>
            <Input
              value={postTitle}
              onChange={(e) => {
                const v = e.target.value;
                setPostTitle(v);
                if (v.trim().length < 3)
                  setTitleError('Tiêu đề phải có ít nhất 3 ký tự');
                else setTitleError(null);
              }}
              placeholder="Tiêu đề bài viết"
              id="title"
              required
              maxLength={200}
              minLength={3}
              aria-invalid={!!titleError}
            />
            {titleError && (
              <p className="text-xs text-destructive mt-1">{titleError}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-slate-600">Ảnh bài viết</label>
            <Input
              id="picture"
              type="file"
              accept="image/*"
              placeholder="Chọn ảnh cho bài viết"
              onChange={(e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (!file) return;
                uploadMutation.mutate(
                  { file },
                  {
                    onSuccess: (res: {
                      flag: boolean;
                      code: number;
                      data: string;
                    }) => {
                      if (res.code === 200) setPostImage(res.data);
                      toast.success('Tải ảnh lên thành công');
                    },
                    onError: () => {
                      toast.error('Tải ảnh lên thất bại. Vui lòng thử lại.');
                    },
                  },
                );
              }}
              disabled={uploadMutation.isPending}
            />
            {uploadMutation.progress > 0 && uploadMutation.isPending && (
              <Progress
                value={uploadMutation.progress}
                className="w-full h-[10px] mt-2"
              />
            )}
            {postImage && (
              <div className="mt-2 w-full h-60 overflow-hidden rounded-md border bg-white">
                <img
                  src={postImage}
                  alt="thumbnail preview"
                  className="object-cover w-full h-60"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '';
                  }}
                />
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label
              htmlFor="content"
              className="flex items-center justify-between"
            >
              <span>
                Nội dung <span className="text-red-500">*</span>
              </span>
            </Label>

            <TooltipProvider>
              <Tooltip>
                <div>
                  <MinimalTiptapEditor
                    value={answer}
                    onChange={(v) => {
                      const newVal =
                        typeof v === 'string' ? v : JSON.stringify(v);
                      setAnswer(newVal);
                      const plain = stripHtml(newVal || '');
                      if (plain.length < 10)
                        setContentError('Nội dung phải có ít nhất 10 ký tự');
                      else setContentError(null);
                    }}
                    output="html"
                    placeholder="Nhập nội dung bài viết..."
                    editorContentClassName="min-h-[200px] p-4"
                    className="max-h-[500px] overflow-y-auto"
                  />
                  {contentError && (
                    <p className="text-xs text-destructive mt-1">
                      {contentError}
                    </p>
                  )}
                </div>
                {!answer && (
                  <TooltipContent side="bottom">
                    <p>Nhấp vào đây để bắt đầu nhập câu trả lời của bạn</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={handleClose}>
              Hủy
            </Button>
            <Button
              onClick={() => {
                const title = postTitle.trim();
                const content = answer || '';
                const plain = stripHtml(content);

                if (!title) {
                  setTitleError('Tiêu đề là bắt buộc');
                  return;
                }
                if (title.length < 3) {
                  setTitleError('Tiêu đề phải có ít nhất 3 ký tự');
                  return;
                }
                if (!plain) {
                  setContentError('Nội dung là bắt buộc');
                  return;
                }
                if (plain.length < 10) {
                  setContentError('Nội dung phải có ít nhất 10 ký tự');
                  return;
                }

                const payload = {
                  title,
                  content,
                  imgUrl: postImage || '',
                  tagIds: [],
                };

                createForumPostMutation.mutate(payload, {
                  onSuccess: () => {
                    handleClose();
                    setPostTitle('');
                    setPostImage('');
                    setAnswer('');
                    setTitleError(null);
                    setContentError(null);
                    toast.success('Đã tạo bài viết thành công.');
                    onCreated?.();
                  },
                  onError: (error) => {
                    toast.error(
                      error instanceof Error
                        ? error.message
                        : 'Không thể tạo bài viết. Vui lòng thử lại.',
                    );
                  },
                });
              }}
              disabled={
                !postTitle.trim() ||
                !!titleError ||
                !answer ||
                !stripHtml(answer).length ||
                !!contentError ||
                createForumPostMutation.isPending
              }
            >
              {createForumPostMutation.isPending ? 'Đang đăng...' : 'Đăng'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePostDialog;
