import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import AvatarUpload from '@/components/file-upload/avatar-upload';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useUploadFileMutation } from '@/features/media/services/mutations';

import {
  useCreateUserMutation,
  useEditUserMutation,
} from '../services/mutations';
import { RoleIUser, type IUser } from '../types';

import type { FileWithPreview } from '@/hooks/use-file-upload';

const userFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .or(z.literal('')),
  fullName: z.string().optional().default(''),
  avatarUrl: z.string().optional().default(''),
  roles: z.nativeEnum(RoleIUser),
  enabled: z.boolean().default(true),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UsersFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: IUser;
}

export const UsersFormDialog = ({
  open,
  onOpenChange,
  initialData,
}: UsersFormDialogProps) => {
  const { t } = useTranslation('pages.admin');
  const createMutation = useCreateUserMutation();
  const editMutation = useEditUserMutation();
  const uploadFileMutation = useUploadFileMutation();
  const isLoading =
    createMutation.isPending ||
    editMutation.isPending ||
    uploadFileMutation.isPending;

  const [passwordRequired, setPasswordRequired] = useState(!initialData);
  const [avatarFile, setAvatarFile] = useState<FileWithPreview | null>(null);
  const [avatarRemoved, setAvatarRemoved] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
      avatarUrl: '',
      roles: RoleIUser.USER,
      enabled: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        email: initialData.email,
        password: '',
        fullName: initialData.fullName || '',
        avatarUrl: initialData.avatarUrl || '',
        roles: initialData.roles,
        enabled: initialData.enabled,
      });
      setPasswordRequired(false);
      setAvatarFile(null);
      setAvatarRemoved(false);
    } else {
      form.reset({
        email: '',
        password: '',
        fullName: '',
        avatarUrl: '',
        roles: RoleIUser.USER,
        enabled: true,
      });
      setPasswordRequired(true);
      setAvatarFile(null);
      setAvatarRemoved(false);
    }
  }, [initialData, open, form]);

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarRemoved(true);
    form.setValue('avatarUrl', '');
  };

  const onSubmit = async (values: UserFormValues) => {
    try {
      let avatarUrl = values.avatarUrl;

      // Upload avatar if a new file was selected
      if (avatarFile && avatarFile.file instanceof File) {
        const uploadedUrl = await uploadFileMutation.mutateAsync({
          file: avatarFile.file,
        });
        avatarUrl = uploadedUrl.data;
      } else if (avatarRemoved) {
        // Clear avatar if it was explicitly removed
        avatarUrl = '';
      }

      if (initialData) {
        const updateData = {
          fullName: values.fullName,
          avatarUrl,
          roles: values.roles,
          enabled: values.enabled,
          ...(values.password.length > 0 && { password: values.password }),
        };
        await editMutation.mutateAsync({
          id: initialData.id,
          ...updateData,
        });
      } else {
        await createMutation.mutateAsync({
          email: values.email,
          password: values.password,
          fullName: values.fullName,
          avatarUrl,
          roles: values.roles,
          enabled: values.enabled,
        });
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {initialData ? t('users.edit_user') : t('users.create_user')}
          </SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-6"
          >
            <FormField
              control={form.control}
              name="avatarUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('users.form.avatar')}</FormLabel>
                  <FormControl>
                    <AvatarUpload
                      defaultAvatar={field.value}
                      onFileChange={(file) => {
                        setAvatarFile(file);
                      }}
                      onRemove={handleRemoveAvatar}
                      maxSize={2 * 1024 * 1024}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('users.form.email')} {!initialData && '*'}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="user@example.com"
                      type="email"
                      disabled={!!initialData}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('users.form.password')} {passwordRequired && '*'}
                    {initialData &&
                      ` (${t('users.form.password_keep_current')})`}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        initialData
                          ? t('users.form.password_placeholder_edit')
                          : t('users.form.password_placeholder_create')
                      }
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('users.form.full_name')}</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('users.form.role')} *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={RoleIUser.USER}>
                        {t('users.form.role_user')}
                      </SelectItem>
                      <SelectItem value={RoleIUser.ADMIN}>
                        {t('users.form.role_admin')}
                      </SelectItem>
                      <SelectItem value={RoleIUser.EXPERT}>
                        {t('users.form.role_expert')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('users.form.status')} *</FormLabel>
                  <Select
                    value={field.value ? 'active' : 'inactive'}
                    onValueChange={(value) =>
                      field.onChange(value === 'active')
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">
                        {t('users.form.status_active')}
                      </SelectItem>
                      <SelectItem value="inactive">
                        {t('users.form.status_inactive')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-6">
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? t('common.save') + '...'
                  : initialData
                    ? t('users.form.update_user')
                    : t('users.form.create_user')}
              </Button>
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  {t('common.cancel')}
                </Button>
              </SheetClose>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
