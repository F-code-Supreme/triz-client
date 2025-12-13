import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import AvatarUpload from '@/components/file-upload/avatar-upload';
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  AchievementType,
  AchievementStatus,
} from '@/features/achievement/types';
import { useUploadFileMutation } from '@/features/media/services/mutations';

import type { Achievement } from '@/features/achievement/types';
import type { FileWithPreview } from '@/hooks/use-file-upload';

interface AchievementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  achievement: Achievement | null;
  onSave: (data: Partial<Achievement>) => void;
}

const AchievementDialog: React.FC<AchievementDialogProps> = ({
  open,
  onOpenChange,
  achievement,
  onSave,
}) => {
  const { t } = useTranslation('pages.admin');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<FileWithPreview | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const uploadFileMutation = useUploadFileMutation();

  const form = useForm<Partial<Achievement>>({
    defaultValues: {
      name: '',
      description: '',
      imageUrl: '',
      type: AchievementType.FIRST_BOOK,
      status: AchievementStatus.INACTIVE,
      milestoneCount: null,
    },
  });

  useEffect(() => {
    if (achievement) {
      form.reset({
        name: achievement.name,
        description: achievement.description,
        imageUrl: achievement.imageUrl,
        type: achievement.type,
        status: achievement.status,
        milestoneCount: achievement.milestoneCount,
      });
      setImageFile(null);
      setImageRemoved(false);
    } else {
      form.reset({
        name: '',
        description: '',
        imageUrl: '',
        type: AchievementType.FIRST_BOOK,
        status: AchievementStatus.INACTIVE,
        milestoneCount: null,
      });
      setImageFile(null);
      setImageRemoved(false);
    }
  }, [achievement, form, open]);

  const handleRemoveImage = () => {
    setImageFile(null);
    setImageRemoved(true);
    form.setValue('imageUrl', '');
  };

  const handleSubmit = async (data: Partial<Achievement>) => {
    setIsSubmitting(true);
    try {
      let imageUrl = data.imageUrl;

      // Upload image if a new file was selected
      if (imageFile && imageFile.file instanceof File) {
        const uploadedUrl = await uploadFileMutation.mutateAsync({
          file: imageFile.file,
        });
        imageUrl = uploadedUrl.data;
      } else if (imageRemoved) {
        // Clear image if it was explicitly removed
        imageUrl = '';
      }

      onSave({ ...data, imageUrl });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedType = form.watch('type');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {achievement
              ? t('achievements.dialog.edit_title')
              : t('achievements.dialog.create_title')}
          </DialogTitle>
          <DialogDescription>
            {achievement
              ? t('achievements.dialog.edit_description')
              : t('achievements.dialog.create_description')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              rules={{ required: t('achievements.dialog.form.name_required') }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('achievements.dialog.form.name')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        'achievements.dialog.form.name_placeholder',
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              rules={{
                required: t('achievements.dialog.form.description_required'),
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('achievements.dialog.form.description')}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t(
                        'achievements.dialog.form.description_placeholder',
                      )}
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('achievements.dialog.form.image')}</FormLabel>
                  <FormControl>
                    <AvatarUpload
                      defaultAvatar={field.value}
                      onFileChange={(file) => {
                        setImageFile(file);
                        setImageRemoved(false);
                      }}
                      onRemove={handleRemoveImage}
                      maxSize={2 * 1024 * 1024}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('achievements.dialog.form.image_description')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('achievements.dialog.form.type')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            'achievements.dialog.form.type_placeholder',
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={AchievementType.FIRST_BOOK}>
                        {t('achievements.type.first_book')}
                      </SelectItem>
                      <SelectItem value={AchievementType.BOOK_MILESTONE}>
                        {t('achievements.type.book_milestone')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('achievements.dialog.form.status')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            'achievements.dialog.form.status_placeholder',
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={AchievementStatus.ACTIVE}>
                        {t('achievements.status_filter.active')}
                      </SelectItem>
                      <SelectItem value={AchievementStatus.INACTIVE}>
                        {t('achievements.status_filter.inactive')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedType === AchievementType.BOOK_MILESTONE && (
              <FormField
                control={form.control}
                name="milestoneCount"
                rules={{
                  required: t(
                    'achievements.dialog.form.milestone_count_required',
                  ),
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('achievements.dialog.form.milestone_count')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder={t(
                          'achievements.dialog.form.milestone_count_placeholder',
                        )}
                        {...field}
                        value={field.value || ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : null,
                          )
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        'achievements.dialog.form.milestone_count_description',
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting || uploadFileMutation.isPending}
              >
                {t('achievements.dialog.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || uploadFileMutation.isPending}
              >
                {isSubmitting || uploadFileMutation.isPending
                  ? t('achievements.dialog.saving')
                  : achievement
                    ? t('achievements.dialog.update')
                    : t('achievements.dialog.create')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AchievementDialog;
