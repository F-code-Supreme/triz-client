import { type ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/data-table/column-header';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ReportPostsDataTableRowActions } from '@/features/report/components/report-posts-data-table-row-actions';
import { formatDate } from '@/utils';

import type { Report } from '@/features/report/types';

export const reportPostsColumns: ColumnDef<Report>[] = [
  {
    accessorKey: 'forumPostTitle',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tiêu đề bài viết" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]">
            {row.getValue('forumPostTitle') || 'N/A'}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'reporterName',
    header: () => <span>Người dùng</span>,
    cell: ({ row }) => {
      const reporterName = row.getValue('reporterName') as string;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-[200px] truncate text-sm cursor-help">
                {reporterName || 'N/A'}
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[300px]">
              <p className="text-xs">{reporterName || 'No description'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },

  {
    accessorKey: 'status',
    header: () => <span>Trạng thái</span>,
    cell: ({ row }) => {
      const status = row.getValue('status') as string;

      const STATUS_MAP: Record<string, { label: string; className: string }> = {
        PENDING: {
          label: 'Chờ xử lý',
          className: 'bg-yellow-100 text-yellow-800',
        },
        IN_REVIEW: {
          label: 'Đang xem xét',
          className: 'bg-blue-100 text-blue-800',
        },
        RESOLVED: {
          label: 'Đã giải quyết',
          className: 'bg-green-100 text-green-700',
        },
        REJECTED: { label: 'Bị từ chối', className: 'bg-red-100 text-red-700' },
        DISMISSED: { label: 'Bị hủy', className: 'bg-gray-100 text-gray-700' },
      };

      const mapped = STATUS_MAP[status] || {
        label: status || 'N/A',
        className: 'bg-gray-100 text-gray-700',
      };

      return (
        <Badge
          variant="default"
          className={`${mapped.className} hover:opacity-90`}
        >
          {mapped.label}
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
          {formatDate(new Date(date))}
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
          {formatDate(new Date(date))}
        </div>
      );
    },
  },
  {
    accessorKey: 'reason',
    header: () => <span>Lý do</span>,
    cell: ({ row }) => {
      const reason = (row.getValue('reason') || '') as string;

      const REASON_MAP: Record<string, string> = {
        OTHER: 'Khác',
        ADULT_CONTENT: 'Nội dung người lớn',
        HARASSMENT: 'Quấy rối',
        HATE_SPEECH: 'Lời nói thù hận',
        SPAM: 'Spam',
        VIOLENCE: 'Bạo lực',
        COPYRIGHT_VIOLATION: 'Vi phạm bản quyền',
        INAPPROPRIATE_CONTENT: 'Nội dung không phù hợp',
        FALSE_INFORMATION: 'Thông tin sai lệch',
      };

      const label = REASON_MAP[reason] || reason || 'N/A';

      return <div className="text-sm text-gray-600">{label}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <ReportPostsDataTableRowActions row={row} />,
  },
];
