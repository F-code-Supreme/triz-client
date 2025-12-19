/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { DataTableColumnHeader } from '@/components/data-table/column-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

import { RoleIUser } from '../types';
import { UsersDataTableRowActions } from './users-data-table-row-actions';

import type { IUser } from '../types';

export const roleColors: Record<RoleIUser, string> = {
  [RoleIUser.USER]: 'bg-blue-100 text-blue-800 hover:bg-blue-100/90',
  [RoleIUser.ADMIN]: 'bg-red-100 text-red-800 hover:bg-red-100/90',
  [RoleIUser.EXPERT]: 'bg-purple-100 text-purple-800 hover:bg-purple-100/90',
  [RoleIUser.MODERATOR]: 'bg-green-100 text-green-800 hover:bg-green-100/90',
};

export const useAdminUsersColumns = () => {
  const { t } = useTranslation('pages.admin');

  return useMemo(
    () =>
      [
        {
          accessorKey: 'avatarUrl',
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={t('users.form.avatar')}
            />
          ),
          cell: ({ row }) => {
            const avatarUrl = row.getValue('avatarUrl') as string | undefined;
            const fullName = row.getValue('fullName') as string | undefined;
            const email = row.getValue('email') as string;

            return (
              <Avatar className="h-10 w-10">
                <AvatarImage src={avatarUrl} alt={fullName || email} />
                <AvatarFallback>
                  {fullName?.slice(0, 2).toUpperCase() ||
                    email.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            );
          },
          enableSorting: false,
        },
        {
          accessorKey: 'email',
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={t('users.form.email')}
            />
          ),
          cell: ({ row }) => {
            return (
              <div className="max-w-48 truncate">
                <span className="font-medium">{row.getValue('email')}</span>
              </div>
            );
          },
        },
        {
          accessorKey: 'fullName',
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={t('users.form.full_name')}
            />
          ),
          cell: ({ row }) => {
            return <div>{row.getValue('fullName') || 'N/A'}</div>;
          },
        },
        {
          accessorKey: 'roles',
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={t('users.form.role')}
            />
          ),
          cell: ({ row }) => {
            const role = row.getValue('roles') as RoleIUser;

            return (
              <div className="flex gap-1">
                <Badge
                  key={role}
                  variant="secondary"
                  className={`capitalize ${roleColors[role]}`}
                >
                  {t(`users.form.role_${role.toLowerCase()}` as any)}
                </Badge>
              </div>
            );
          },
        },
        {
          accessorKey: 'enabled',
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={t('users.form.status')}
            />
          ),
          cell: ({ row }) => {
            const enabled = row.getValue('enabled') as boolean;
            return (
              <Badge variant={enabled ? 'default' : 'destructive'}>
                {enabled
                  ? t('users.form.status_active')
                  : t('users.form.status_inactive')}
              </Badge>
            );
          },
        },
        {
          id: 'actions',
          header: ({ column }) => (
            <DataTableColumnHeader
              column={column}
              title={t('common.actions')}
            />
          ),
          cell: ({ row }) => <UsersDataTableRowActions row={row} />,
          enableSorting: false,
          enableHiding: false,
        },
      ] as ColumnDef<IUser>[],
    [t],
  );
};
