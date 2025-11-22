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
  // optional callback when save/create completes
  onSaved?: () => void;
};

export const AddLessonModal: React.FC<AddLessonModalProps> = ({
  open,
  onOpenChange,
  moduleId,
  lessonId,
  onSaved,
}) => {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [lessonType, setLessonType] = React.useState<LessonType>('TEXT');
  const [content, setContent] = React.useState<Content>('');
  const [videoFile, setVideoFile] = React.useState<File | null>(null);
  const createLessonMutation = useCreateLessonMutation(moduleId);
  const updateLessonMutation = useUpdateLessonMutation(lessonId || '');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // fetch lesson via query hook when editing
  const lessonQuery = useGetLessonById(lessonId);
  const isFetching = lessonQuery.isFetching;
  const isSubmitting =
    createLessonMutation.isPending || updateLessonMutation.isPending;

  // fetch existing lesson when editing
  useEffect(() => {
    if (!lessonQuery.data) return;
    const data = lessonQuery.data;
    setTitle(data.title ?? '');
    setDescription(data.description ?? '');
    setLessonType(
      (data.type ?? 'TEXT').toUpperCase() === 'VIDEO' ? 'VIDEO' : 'TEXT',
    );
    setContent(data.content ?? '');
    // do not set videoFile — user must re-upload if they want to replace
  }, [lessonQuery.data]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type (video files only)
      const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
      if (!validVideoTypes.includes(file.type)) {
        toast.error('Please select a valid video file (MP4, WebM, or OGG)');
        return;
      }
      setVideoFile(file);
    }
  };

  const submitUpdate = async () => {
    if (lessonType === 'TEXT') {
      const contentValue =
        typeof content === 'string' ? content : JSON.stringify(content ?? '');
      const payload = {
        title: title.trim(),
        description: description.trim(),
        content: contentValue.trim(),
        type: 'TEXT',
      };
      await updateLessonMutation.mutateAsync(payload as CreateLessonPayload);
      return;
    }

    // VIDEO update
    if (videoFile) {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('type', 'VIDEO');
      formData.append('video', videoFile);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await updateLessonMutation.mutateAsync(formData as any);
    } else {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        type: 'VIDEO',
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await updateLessonMutation.mutateAsync(payload as any);
    }
  };

  const submitCreate = async () => {
    if (lessonType === 'TEXT') {
      const contentValue =
        typeof content === 'string' ? content : JSON.stringify(content ?? '');
      const payload = {
        title: title.trim(),
        description: description.trim(),
        content: contentValue.trim(),
        type: 'TEXT',
      };
      await createLessonMutation.mutateAsync(payload as CreateLessonPayload);
      return;
    }

    // VIDEO create
    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('type', 'VIDEO');
    if (videoFile) formData.append('video', videoFile);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await createLessonMutation.mutateAsync(formData as any);
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
      // when creating a new VIDEO lesson, file is required; when updating, skip if not changing
      toast.error('Please select a video file');
      return;
    }

    try {
      if (lessonId) {
        await submitUpdate();
        toast.success('Lesson updated successfully');
      } else {
        await submitCreate();
        toast.success('Lesson created successfully');
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
            <DialogTitle>{lessonId ? 'Edit Lesson' : 'Add Lesson'}</DialogTitle>
            <DialogDescription>
              {lessonId
                ? 'Edit the lesson details. Upload a new video only if you want to replace it.'
                : 'Create a new lesson for this module. Fill in all the required fields below.'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter lesson title"
                required
                disabled={isFetching || isSubmitting}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter lesson description"
                rows={3}
                required
                disabled={isFetching || isSubmitting}
              />
            </div>

            <div className="grid gap-2">
              <Label>
                Lesson Type <span className="text-red-500">*</span>
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
                    disabled={isFetching || isSubmitting}
                  />
                  <span className="text-sm font-medium">Content</span>
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
                    disabled={isFetching || isSubmitting}
                  />
                  <span className="text-sm font-medium">Video</span>
                </label>
              </div>
            </div>

            {lessonType === 'TEXT' ? (
              <div className="grid gap-2">
                <Label htmlFor="content">
                  Content <span className="text-red-500">*</span>
                </Label>
                <TooltipProvider>
                  <MinimalTiptapEditor
                    value={content}
                    onChange={setContent}
                    output="json"
                    placeholder="Start writing..."
                    editorContentClassName="min-h-64 p-4"
                  />
                </TooltipProvider>
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="video">
                  Video File <span className="text-red-500">*</span>
                </Label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Input
                      id="video"
                      ref={fileInputRef}
                      type="file"
                      accept="video/mp4,video/webm,video/ogg"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                      required
                      disabled={isFetching || isSubmitting}
                    />
                  </div>
                  {videoFile && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{videoFile.name}</p>
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
                        disabled={isFetching || isSubmitting}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Supported formats: MP4, WebM, OGG
                  </p>
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
              Cancel
            </Button>
            <Button type="submit" disabled={isFetching || isSubmitting}>
              {isSubmitting
                ? lessonId
                  ? 'Updating...'
                  : 'Creating...'
                : lessonId
                  ? 'Update Lesson'
                  : 'Create Lesson'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
