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
import { MinimalTiptapEditor } from '@/components/ui/minimal-tiptap';
import { isEditorEmpty } from '@/components/ui/minimal-tiptap/utils';
import { Textarea } from '@/components/ui/textarea';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useCreateVideoLessonMutation,
} from '@/features/lesson/services/mutations';
import { useGetLessonById } from '@/features/lesson/services/queries';

import type { CreateLessonPayload } from '@/features/lesson/services/mutations/types';
import type { Content } from '@tiptap/react';

type LessonType = 'TEXT' | 'VIDEO';

type AddLessonModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleId: string;
  lessonId?: string;
  onSaved?: () => void;
  viewMode?: boolean;
};

export const AddLessonModal: React.FC<AddLessonModalProps> = ({
  open,
  onOpenChange,
  moduleId,
  lessonId,
  onSaved,
  viewMode = false,
  // eslint-disable-next-line sonarjs/cognitive-complexity
}) => {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [lessonType, setLessonType] = React.useState<LessonType>('TEXT');
  const [content, setContent] = React.useState<Content>('');
  const [videoFile, setVideoFile] = React.useState<File | null>(null);
  const [existingVideoUrl, setExistingVideoUrl] = React.useState<string>('');
  const createLessonMutation = useCreateLessonMutation(moduleId);
  const createVideoLessonMutation = useCreateVideoLessonMutation(moduleId);
  const updateLessonMutation = useUpdateLessonMutation(lessonId || '');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const lessonQuery = useGetLessonById(lessonId);
  const isFetching = lessonQuery.isFetching;
  const isSubmitting =
    createLessonMutation.isPending ||
    createVideoLessonMutation.isPending ||
    updateLessonMutation.isPending;

  const isDisabled = isFetching || isSubmitting || viewMode;

  const parseTextContent = (rawContent: unknown): Content => {
    try {
      // If it's a string, try to detect JSON / HTML / plain text
      if (typeof rawContent === 'string') {
        const trimmed = rawContent.trim();

        // JSON (tiptap document or nodes)
        if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
          return JSON.parse(rawContent);
        }

        // HTML string (e.g. "<p class=...>...</p>") — return raw HTML so the editor can accept it
        if (trimmed.startsWith('<')) {
          return rawContent;
        }

        // plain text — wrap into a minimal doc
        return {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: rawContent }],
            },
          ],
        };
      }

      const parsedContent = rawContent as unknown;
      if (!parsedContent || typeof parsedContent !== 'object') return '';
      const asObj = parsedContent as Record<string, unknown>;
      if (asObj.type === 'doc' && Array.isArray(asObj.content)) {
        return asObj as unknown as Content;
      }

      // Fallback: wrap the object as a single paragraph containing its JSON string
      return {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: JSON.stringify(asObj) }],
          },
        ],
      };
    } catch (error) {
      console.error('Failed to parse lesson content:', error);
      // If the raw content looks like HTML, return it as-is so the editor can render it
      if (
        typeof rawContent === 'string' &&
        String(rawContent).trim().startsWith('<')
      ) {
        return rawContent;
      }

      return {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: String(rawContent) }],
          },
        ],
      };
    }
  };

  const loadLessonData = (data: typeof lessonQuery.data) => {
    if (!data) return;

    setTitle(data.title ?? '');
    setDescription(data.description ?? '');

    const type =
      (data.type ?? 'TEXT').toUpperCase() === 'VIDEO' ? 'VIDEO' : 'TEXT';
    setLessonType(type);

    if (type === 'TEXT' && data.content) {
      setContent(parseTextContent(data.content));
    } else if (type === 'VIDEO') {
      setExistingVideoUrl(data.videoUrl || data.content || '');
    }
  };

  useEffect(() => {
    loadLessonData(lessonQuery.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonQuery.data]);

  // When opening the modal for creating a new lesson (no lessonId),
  // ensure the editor/content are reset (avoid showing previous content).
  useEffect(() => {
    if (open && !lessonId) {
      setContent('');
      setTitle('');
      setDescription('');
      setLessonType('TEXT');
      setVideoFile(null);
      setExistingVideoUrl('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
    // Only run when `open` or `lessonId` changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, lessonId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
      if (!validVideoTypes.includes(file.type)) {
        toast.error('Please select a valid video file (MP4, WebM, or OGG)');
        return;
      }
      setVideoFile(file);
    }
  };

  const createTextLesson = async () => {
    const contentValue =
      typeof content === 'string' ? content : JSON.stringify(content ?? '');
    const payload = {
      title: title.trim(),
      description: description.trim(),
      content: contentValue.trim(),
      type: 'TEXT',
    };
    await createLessonMutation.mutateAsync(payload as CreateLessonPayload);
  };

  const uploadVideoAndGetUrl = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const uploadResponse =
      await createVideoLessonMutation.mutateAsync(formData);

    if (!uploadResponse) {
      console.error(
        'Failed to extract video URL from response:',
        uploadResponse,
      );
      toast.error('Failed to get video URL from upload');
      throw new Error('Failed to get video URL');
    }

    return uploadResponse;
  };

  const createVideoLesson = async () => {
    if (!videoFile) {
      toast.error('Please select a video file');
      return;
    }

    const videoUrl = await uploadVideoAndGetUrl(videoFile);
    const lessonPayload = {
      title: title.trim(),
      description: description.trim(),
      videoUrl,
      type: 'VIDEO' as const,
    };
    await createLessonMutation.mutateAsync(lessonPayload);
  };

  const submitCreate = async () => {
    if (lessonType === 'TEXT') {
      await createTextLesson();
      return;
    }
    await createVideoLesson();
  };

  const updateTextLesson = async () => {
    const contentValue =
      typeof content === 'string' ? content : JSON.stringify(content ?? '');
    const payload = {
      title: title.trim(),
      description: description.trim(),
      content: contentValue.trim(),
      type: 'TEXT',
    };
    await updateLessonMutation.mutateAsync(payload as CreateLessonPayload);
  };

  const updateVideoLesson = async () => {
    const basePayload = {
      title: title.trim(),
      description: description.trim(),
      type: 'VIDEO',
    };

    if (videoFile) {
      const videoUrl = await uploadVideoAndGetUrl(videoFile);
      const payload = {
        ...basePayload,
        videoUrl,
      } as unknown as CreateLessonPayload;
      await updateLessonMutation.mutateAsync(payload);
    } else {
      const payload = basePayload as unknown as CreateLessonPayload;
      await updateLessonMutation.mutateAsync(payload);
    }
  };

  const submitUpdate = async () => {
    if (lessonType === 'TEXT') {
      await updateTextLesson();
      return;
    }
    await updateVideoLesson();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Lesson title is required');
      return;
    }
    if (!description.trim()) {
      toast.error('Lesson description is required');
      return;
    }

    if (lessonType === 'TEXT' && isEditorEmpty(content)) {
      toast.error('Content is required');
      return;
    }
    if (lessonType === 'VIDEO' && !videoFile && !lessonId) {
      toast.error('Please select a video file');
      return;
    }

    try {
      if (lessonId) {
        await submitUpdate();
        toast.success('Cập nhật bài học thành công');
      } else {
        await submitCreate();
        toast.success('Tạo bài học thành công');
      }
      handleClose();
      onSaved?.();
    } catch (error) {
      let msg = 'Failed to create lesson';
      if (error instanceof Error) msg = error.message;
      else if (typeof error === 'string') msg = error;
      toast.error(msg);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setLessonType('TEXT');
    setContent('');
    setVideoFile(null);
    setExistingVideoUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {viewMode
                ? 'Xem bài học'
                : lessonId
                  ? 'Chỉnh sửa bài học'
                  : 'Thêm bài học'}
            </DialogTitle>
            <DialogDescription>
              {viewMode
                ? 'Xem chi tiết bài học.'
                : lessonId
                  ? 'Chỉnh sửa chi tiết bài học. Tải lên video mới chỉ khi bạn muốn thay thế.'
                  : 'Tạo bài học mới cho chương này. Vui lòng điền tất cả các trường bắt buộc bên dưới.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">
                Tiêu đề {!viewMode && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề bài học"
                required={!viewMode}
                disabled={isDisabled}
                readOnly={viewMode}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">
                Mô tả {!viewMode && <span className="text-red-500">*</span>}
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả bài học"
                rows={3}
                required={!viewMode}
                disabled={isDisabled}
                readOnly={viewMode}
              />
            </div>

            <div className="grid gap-2">
              <Label>
                Loại bài học{' '}
                {!viewMode && <span className="text-red-500">*</span>}
              </Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="lessonType"
                    value="TEXT"
                    checked={lessonType === 'TEXT'}
                    onChange={(e) =>
                      setLessonType(e.target.value as LessonType)
                    }
                    className="w-4 h-4 text-blue-600"
                    disabled={isDisabled || !!lessonId}
                  />
                  <span className="text-sm font-medium">Nội dung</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="lessonType"
                    value="VIDEO"
                    checked={lessonType === 'VIDEO'}
                    onChange={(e) =>
                      setLessonType(e.target.value as LessonType)
                    }
                    className="w-4 h-4 text-blue-600"
                    disabled={isDisabled || !!lessonId}
                  />
                  <span className="text-sm font-medium">Video</span>
                </label>
              </div>
              {lessonId && !viewMode && (
                <p className="text-xs text-muted-foreground">
                  Loại bài học không thể thay đổi khi chỉnh sửa
                </p>
              )}
            </div>

            {lessonType === 'TEXT' ? (
              <div className="grid gap-2">
                <Label htmlFor="content">
                  Nội dung{' '}
                  {!viewMode && <span className="text-red-500">*</span>}
                </Label>
                <TooltipProvider>
                  <MinimalTiptapEditor
                    key={lessonId ? `editor-${lessonId}` : 'editor-new'}
                    value={content}
                    onChange={setContent}
                    output="html"
                    placeholder={viewMode ? '' : 'Bắt đầu viết...'}
                    editorContentClassName="min-h-64 p-4"
                    editable={!viewMode}
                  />
                </TooltipProvider>
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="video">
                  Video{' '}
                  {!lessonId && !viewMode && (
                    <span className="text-red-500">*</span>
                  )}
                </Label>
                <div className="flex flex-col gap-2">
                  {existingVideoUrl && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm font-medium text-blue-900 mb-2">
                        {viewMode ? 'Video:' : 'Video hiện tại:'}
                      </p>
                      <video
                        src={existingVideoUrl}
                        controls
                        className="w-full max-h-80 rounded"
                      >
                        Trình duyệt của bạn không hỗ trợ thẻ video.
                      </video>
                      {!viewMode && (
                        <p className="text-xs text-blue-700 mt-2">
                          Tải lên video mới bên dưới để thay thế
                        </p>
                      )}
                    </div>
                  )}

                  {!viewMode && (
                    <>
                      <div className="flex items-center gap-2">
                        <Input
                          id="video"
                          ref={fileInputRef}
                          type="file"
                          accept="video/mp4,video/webm,video/ogg"
                          onChange={handleFileChange}
                          className="cursor-pointer"
                          required={!lessonId && !existingVideoUrl}
                          disabled={isDisabled}
                        />
                      </div>
                      {videoFile && (
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border">
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {videoFile.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setVideoFile(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                            disabled={isDisabled}
                          >
                            Xóa
                          </Button>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Định dạng hỗ trợ: MP4, WebM, OGG
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
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
              <Button type="submit" disabled={isDisabled}>
                {isSubmitting
                  ? lessonId
                    ? 'Đang cập nhật...'
                    : 'Đang tạo...'
                  : lessonId
                    ? 'Cập nhật bài học'
                    : 'Tạo bài học'}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
