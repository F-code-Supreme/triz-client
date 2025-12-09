import { Link } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';

import { DataTableColumnHeader } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { AdminSubscriptionsDataTableRowActions } from './admin-subscriptions-data-table-row-actions';

import type { Subscription } from '../types';
import type { DataTimestamp } from '@/types';
import type { TFunction } from 'i18next';

type SubscriptionWithTimestamp = Subscription & DataTimestamp;

const columnHelper = createColumnHelper<SubscriptionWithTimestamp>();

export const getSubscriptionStatusColor = (status: string): string => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800 hover:bg-green-100/90';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100/90';
    case 'EXPIRED':
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100/90';
    case 'CANCELED':
      return 'bg-red-100 text-red-800 hover:bg-red-100/90';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-100/90';
  }
};

export const adminSubscriptionsColumns = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: TFunction<'pages.admin', undefined> | ((key: string) => any),
) => [
  columnHelper.accessor('userId', {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t('subscriptions.columns.user_id')}
      />
    ),
    cell: (info) => {
      const id = info.getValue();
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                to="/admin/users/$userId"
                params={{ userId: id }}
                className="w-[100px] truncate font-mono text-sm cursor-pointer hover:underline text-secondary block"
              >
                {id}
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-mono text-xs">
              {id}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    size: 150,
  }),
  columnHelper.accessor('packageName', {
    id: 'packagePlanId',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t('subscriptions.columns.package')}
      />
    ),
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  }),

  columnHelper.accessor('startDate', {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t('subscriptions.columns.start_date')}
      />
    ),
    cell: (info) => {
      const date = info.getValue();
      return <span>{format(new Date(date), 'MMM dd, yyyy')}</span>;
    },
  }),

  columnHelper.accessor('endDate', {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t('subscriptions.columns.end_date')}
      />
    ),
    cell: (info) => {
      const date = info.getValue();
      return <span>{format(new Date(date), 'MMM dd, yyyy')}</span>;
    },
  }),

  columnHelper.accessor('tokensPerDayRemaining', {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t('subscriptions.columns.trizilium_per_day')}
      />
    ),
    cell: (info) => <span className="font-semibold">{info.getValue()}</span>,
  }),

  columnHelper.accessor('status', {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t('subscriptions.columns.status')}
      />
    ),
    cell: (info) => {
      const status = info.getValue();
      const colors = getSubscriptionStatusColor(status);
      return <Badge className={colors}>{status}</Badge>;
    },
  }),

  columnHelper.accessor('autoRenew', {
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t('subscriptions.columns.auto_renewal')}
      />
    ),
    cell: (info) => (
      <Badge variant={info.getValue() ? 'default' : 'outline'}>
        {info.getValue()
          ? t('subscriptions.status.enabled')
          : t('subscriptions.status.disabled')}
      </Badge>
    ),
  }),

  columnHelper.display({
    id: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t('subscriptions.columns.actions')}
      />
    ),
    cell: ({ row }) => <AdminSubscriptionsDataTableRowActions row={row} />,
    enableSorting: false,
    enableHiding: false,
  }),
];

export const createAdminSubscriptionsColumns = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: TFunction<'pages.admin', undefined> | ((key: string) => any),
  onAutoRenewalToggle?: (subscription: SubscriptionWithTimestamp) => void,
) => {
  const columns = adminSubscriptionsColumns(t);

  return columns.map((column) => {
    if (column.id === 'actions') {
      return {
        ...column,
        cell: ({ row }: { row: { original: SubscriptionWithTimestamp } }) => (
          <AdminSubscriptionsDataTableRowActions
            row={row}
            onAutoRenewalToggle={onAutoRenewalToggle}
          />
        ),
      };
    }
    return column;
  });
};
