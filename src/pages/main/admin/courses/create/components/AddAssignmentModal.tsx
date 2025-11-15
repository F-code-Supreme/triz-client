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

type AddAssignmentModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleId: string;
};

export const AddAssignmentModal: React.FC<AddAssignmentModalProps> = ({
  open,
  onOpenChange,
  moduleId: _moduleId,
}) => {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [durationInMinutes, setDurationInMinutes] = React.useState<number>(60);
  const [maxAttempts, setMaxAttempts] = React.useState<number>(3);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Assignment title is required');
      return;
    }

    if (!description.trim()) {
      toast.error('Assignment description is required');
      return;
    }

    if (durationInMinutes <= 0) {
      toast.error('Duration must be greater than 0');
      return;
    }

    if (maxAttempts <= 0) {
      toast.error('Max attempts must be greater than 0');
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Implement the actual API call to create assignment
      // const response = await createAssignment({
      //   moduleId,
      //   title: title.trim(),
      //   description: description.trim(),
      //   durationInMinutes,
      //   maxAttempts,
      // });

      toast.success('Assignment created successfully');
      handleClose();
    } catch (error) {
      let msg = 'Failed to create assignment';
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
    setDurationInMinutes(60);
    setMaxAttempts(3);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Assignment</DialogTitle>
            <DialogDescription>
              Create a new assignment for this module. Fill in all the required
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
                placeholder="Enter assignment title"
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
                placeholder="Enter assignment description"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="duration">
                  Duration (minutes) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={durationInMinutes}
                  onChange={(e) => setDurationInMinutes(Number(e.target.value))}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="maxAttempts">
                  Max Attempts <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="maxAttempts"
                  type="number"
                  min="1"
                  value={maxAttempts}
                  onChange={(e) => setMaxAttempts(Number(e.target.value))}
                  required
                />
              </div>
            </div>
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
              {isSubmitting ? 'Creating...' : 'Create Assignment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
