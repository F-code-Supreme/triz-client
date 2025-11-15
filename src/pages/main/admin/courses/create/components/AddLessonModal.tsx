import React from 'react';
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
import { Textarea } from '@/components/ui/textarea';

type LessonType = 'content' | 'video';

type AddLessonModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleId: string;
};

export const AddLessonModal: React.FC<AddLessonModalProps> = ({
  open,
  onOpenChange,
  moduleId: _moduleId,
}) => {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [lessonType, setLessonType] = React.useState<LessonType>('content');
  const [content, setContent] = React.useState('');
  const [videoFile, setVideoFile] = React.useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

    if (lessonType === 'content' && !content.trim()) {
      toast.error('Content is required');
      return;
    }

    if (lessonType === 'video' && !videoFile) {
      toast.error('Please select a video file');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement the actual API call to create lesson
      // if (lessonType === 'content') {
      //   await createLesson({
      //     moduleId: _moduleId,
      //     title: title.trim(),
      //     description: description.trim(),
      //     content: content.trim(),
      //   });
      // } else {
      //   const formData = new FormData();
      //   formData.append('moduleId', _moduleId);
      //   formData.append('title', title.trim());
      //   formData.append('description', description.trim());
      //   formData.append('video', videoFile);
      //   await uploadLessonVideo(formData);
      // }

      toast.success('Lesson created successfully');
      handleClose();
    } catch (error) {
      let msg = 'Failed to create lesson';
      if (error instanceof Error) msg = error.message;
      else if (typeof error === 'string') msg = error;
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setLessonType('content');
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
            <DialogTitle>Add Lesson</DialogTitle>
            <DialogDescription>
              Create a new lesson for this module. Fill in all the required
              fields below.
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
                    value="content"
                    checked={lessonType === 'content'}
                    onChange={(e) =>
                      setLessonType(e.target.value as LessonType)
                    }
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm font-medium">Content</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="lessonType"
                    value="video"
                    checked={lessonType === 'video'}
                    onChange={(e) =>
                      setLessonType(e.target.value as LessonType)
                    }
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm font-medium">Video</span>
                </label>
              </div>
            </div>

            {lessonType === 'content' ? (
              <div className="grid gap-2">
                <Label htmlFor="content">
                  Content <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter lesson content"
                  rows={8}
                  required
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  You can use markdown formatting in your content.
                </p>
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
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Lesson'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
