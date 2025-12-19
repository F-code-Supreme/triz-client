import { type ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/data-table/column-header';
import { Badge } from '@/components/ui/badge';
import { AssignmentsDataTableRowActions } from '@/features/assignment/components/assignments-data-table-row-actions';
import { formatDateHour } from '@/utils/date/date';

import type { AssignmentSubmissionExpertReview } from '@/features/assignment/services/queries/types';

export const assignmentsColumns: ColumnDef<AssignmentSubmissionExpertReview>[] =
  [
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
      accessorKey: 'userFullName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tác giả" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
              {row.getValue('userFullName')}
            </span>
          </div>
        );
      },
    },

    {
      accessorKey: 'attemptNumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Số lần làm" />
      ),
      cell: ({ row }) => {
        const maxAttempts = row.getValue('attemptNumber') as number;
        return <div className="text-center">{maxAttempts}</div>;
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trạng thái" />
      ),
      // eslint-disable-next-line sonarjs/cognitive-complexity
      cell: ({ row }) => {
        const status = row.getValue('status') as string;

        return (
          <Badge
            variant={status === 'EXPERT_PENDING' ? 'default' : 'secondary'}
            className={
              status === 'EXPERT_PENDING'
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                : status === 'AI_PENDING'
                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                  : status === 'APPROVED'
                    ? 'bg-green-100 text-green-700 hover:bg-green-100'
                    : status === 'AI_REJECTED' || status === 'REJECTED'
                      ? 'bg-red-100 text-red-700 hover:bg-red-100'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
            }
          >
            {status === 'EXPERT_PENDING'
              ? 'Chờ chuyên gia đánh giá'
              : status === 'AI_PENDING'
                ? 'Chờ AI đánh giá'
                : status === 'APPROVED'
                  ? 'Đã duyệt'
                  : status === 'AI_REJECTED'
                    ? 'AI từ chối'
                    : status === 'REJECTED'
                      ? 'Chuyên gia từ chối'
                      : 'Không xác định'}
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
            {formatDateHour(new Date(date))}
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
            {formatDateHour(new Date(date))}
          </div>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return <AssignmentsDataTableRowActions row={row} />;
      },
    },
  ];
