import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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

import {
  useCreateUserMutation,
  useEditUserMutation,
} from '../services/mutations';
import { RoleIUser, type IUser } from '../types';

const userFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .or(z.literal('')),
  fullName: z.string().optional().default(''),
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
  const createMutation = useCreateUserMutation();
  const editMutation = useEditUserMutation();
  const isLoading = createMutation.isPending || editMutation.isPending;

  const [passwordRequired, setPasswordRequired] = useState(!initialData);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
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
        roles: initialData.roles,
        enabled: initialData.enabled,
      });
      setPasswordRequired(false);
    } else {
      form.reset({
        email: '',
        password: '',
        fullName: '',
        roles: RoleIUser.USER,
        enabled: true,
      });
      setPasswordRequired(true);
    }
  }, [initialData, open, form]);

  const onSubmit = async (values: UserFormValues) => {
    try {
      if (initialData) {
        const updateData = {
          fullName: values.fullName,
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
            {initialData ? 'Edit User' : 'Create New User'}
          </SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-6"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email {!initialData && '*'}</FormLabel>
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
                    Password {passwordRequired && '*'}
                    {initialData && '(Leave empty to keep current)'}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        initialData
                          ? 'Leave empty to keep current password'
                          : 'Password'
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
                  <FormLabel>Full Name</FormLabel>
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
                  <FormLabel>Role *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={RoleIUser.USER}>User</SelectItem>
                      <SelectItem value={RoleIUser.ADMIN}>Admin</SelectItem>
                      <SelectItem value={RoleIUser.EXPERT}>Expert</SelectItem>
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
                  <FormLabel>Status *</FormLabel>
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
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-6">
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? 'Saving...'
                  : initialData
                    ? 'Update User'
                    : 'Create User'}
              </Button>
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};
