import { type ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/data-table/column-header';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { AssignmentsDataTableRowActions } from '@/features/assignment/components/assignments-data-table-row-actions';

import type { Assignment } from '@/features/assignment/services/queries/types';

export const assignmentsColumns: ColumnDef<Assignment>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => {
      const id = row.getValue('id') as string;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-[100px] truncate font-mono text-sm cursor-help">
                {id}
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-mono text-xs">
              {id}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tiêu đề" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue('title') || 'N/A'}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mô tả" />
    ),
    cell: ({ row }) => {
      const description = row.getValue('description') as string;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-[200px] truncate text-sm cursor-help">
                {description || 'N/A'}
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[300px]">
              <p className="text-xs">{description || 'No description'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: 'durationInMinutes',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Thời lượng" />
    ),
    cell: ({ row }) => {
      const duration = row.getValue('durationInMinutes') as number;
      return (
        <div className="flex items-center gap-1">
          <span className="font-medium">{duration}</span>
          <span className="text-xs text-gray-500">phút</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'maxAttempts',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Số lần thử" />
    ),
    cell: ({ row }) => {
      const maxAttempts = row.getValue('maxAttempts') as number;
      return (
        <div className="text-center">
          <Badge variant="outline" className="font-mono">
            {maxAttempts}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;

      return (
        <Badge
          variant={status === 'ACTIVE' ? 'default' : 'secondary'}
          className={
            status === 'ACTIVE'
              ? 'bg-green-100 text-green-700 hover:bg-green-100'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
          }
        >
          {status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngày tạo" />
    ),
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as string;
      if (!date) return <div className="text-gray-400">N/A</div>;

      return (
        <div className="text-sm text-gray-600">
          {new Date(date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })}
        </div>
      );
    },
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cập nhật" />
    ),
    cell: ({ row }) => {
      const date = row.getValue('updatedAt') as string;
      if (!date) return <div className="text-gray-400">N/A</div>;

      return (
        <div className="text-sm text-gray-600">
          {new Date(date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })}
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <AssignmentsDataTableRowActions row={row} />,
  },
];
