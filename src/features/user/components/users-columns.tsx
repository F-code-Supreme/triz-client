import { type ColumnDef } from '@tanstack/react-table';

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
};

export const usersColumns: ColumnDef<IUser>[] = [
  {
    accessorKey: 'avatarUrl',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Avatar" />
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
      <DataTableColumnHeader column={column} title="Email" />
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
      <DataTableColumnHeader column={column} title="Full Name" />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue('fullName') || 'N/A'}</div>;
    },
  },
  {
    accessorKey: 'roles',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Roles" />
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
            {role}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'enabled',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const enabled = row.getValue('enabled') as boolean;
      return (
        <Badge variant={enabled ? 'default' : 'destructive'}>
          {enabled ? 'Active' : 'Inactive'}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => <UsersDataTableRowActions row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
];
