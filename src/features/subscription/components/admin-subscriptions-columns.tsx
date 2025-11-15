import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';

import { DataTableColumnHeader } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';

import { AdminSubscriptionsDataTableRowActions } from './admin-subscriptions-data-table-row-actions';

import type { Subscription } from '../types';
import type { DataTimestamp } from '@/types';

type SubscriptionWithTimestamp = Subscription & DataTimestamp;

const columnHelper = createColumnHelper<SubscriptionWithTimestamp>();

export const getSubscriptionStatusColor = (status: string): string => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'EXPIRED':
      return 'bg-gray-100 text-gray-800';
    case 'CANCELED':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const adminSubscriptionsColumns = [
  columnHelper.accessor('userId', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User ID" />
    ),
    cell: (info) => (
      <span className="font-mono text-sm">
        {info.getValue().slice(0, 8)}...
      </span>
    ),
    size: 150,
  }),
  columnHelper.accessor('packageName', {
    id: 'packagePlanId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Package" />
    ),
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  }),

  columnHelper.accessor('startDate', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start Date" />
    ),
    cell: (info) => {
      const date = info.getValue();
      return <span>{format(new Date(date), 'MMM dd, yyyy')}</span>;
    },
  }),

  columnHelper.accessor('endDate', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Date" />
    ),
    cell: (info) => {
      const date = info.getValue();
      return <span>{format(new Date(date), 'MMM dd, yyyy')}</span>;
    },
  }),

  columnHelper.accessor('tokensPerDayRemaining', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tokens/Day" />
    ),
    cell: (info) => <span className="font-semibold">{info.getValue()}</span>,
  }),

  columnHelper.accessor('status', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: (info) => {
      const status = info.getValue();
      const colors = getSubscriptionStatusColor(status);
      return <Badge className={colors}>{status}</Badge>;
    },
  }),

  columnHelper.accessor('autoRenew', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Auto Renewal" />
    ),
    cell: (info) => (
      <Badge variant={info.getValue() ? 'default' : 'outline'}>
        {info.getValue() ? 'Enabled' : 'Disabled'}
      </Badge>
    ),
  }),

  columnHelper.display({
    id: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => <AdminSubscriptionsDataTableRowActions row={row} />,
    enableSorting: false,
    enableHiding: false,
  }),
];

export const createAdminSubscriptionsColumns = (
  onAutoRenewalToggle?: (subscription: SubscriptionWithTimestamp) => void,
) => {
  return adminSubscriptionsColumns.map((column) => {
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
