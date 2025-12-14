import { type ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/data-table/column-header';
import { Badge } from '@/components/ui/badge';
import { IdeaAssessmentDataTableRowActions } from '@/features/6-steps/components/idea-assessment-data-table-row-actions';

import type { IdeaAssessmentRequest } from '@/features/6-steps/services/queries/types';

export const ideaAssessmentColumns: ColumnDef<IdeaAssessmentRequest>[] = [
  {
    accessorKey: 'journalTitle',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tiêu đề nhật ký" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue('journalTitle') || 'N/A'}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'userFullName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Người dùng" />
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
    accessorKey: 'ideaStatement',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ý tưởng" />
    ),
    cell: ({ row }) => {
      const ideaStatement = row.getValue('ideaStatement') as string;
      return (
        <div className="max-w-md">
          <span className="line-clamp-2 text-sm">{ideaStatement}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'principleUsed',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nguyên tắc TRIZ" />
    ),
    cell: ({ row }) => {
      const principle = row.getValue('principleUsed') as
        | {
            id: number;
            name: string;
          }
        | undefined;

      if (!principle) {
        return <div className="text-gray-400">N/A</div>;
      }

      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">#{principle.id}</span>
          <span className="text-xs text-muted-foreground line-clamp-1">
            {principle.name}
          </span>
        </div>
      );
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
          variant={status === 'PENDING' ? 'default' : 'secondary'}
          className={
            status === 'PENDING'
              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
              : status === 'IN_REVIEW'
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                : status === 'APPROVED'
                  ? 'bg-green-100 text-green-700 hover:bg-green-100'
                  : status === 'REJECTED'
                    ? 'bg-red-100 text-red-700 hover:bg-red-100'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
          }
        >
          {status === 'PENDING'
            ? 'Chờ xử lý'
            : status === 'IN_REVIEW'
              ? 'Đang xem xét'
              : status === 'APPROVED'
                ? 'Đã chấp thuận'
                : status === 'REJECTED'
                  ? 'Từ chối'
                  : status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'expertRating',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Đánh giá" />
    ),
    cell: ({ row }) => {
      const rating = row.getValue('expertRating') as number | null;

      if (rating === null || rating === undefined) {
        return <div className="text-gray-400">Chưa đánh giá</div>;
      }

      return (
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium">{rating}</span>
          <span className="text-xs text-muted-foreground">/5</span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <IdeaAssessmentDataTableRowActions row={row} />;
    },
  },
];
