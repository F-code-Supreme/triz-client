import { createColumnHelper } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { DataTableColumnHeader } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';

import { SubscriptionsDataTableRowActions } from './subscriptions-data-table-row-actions';

import type { Subscription } from '../types';
import type { DataTimestamp } from '@/types';

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

export const useSubscriptionsColumns = () => {
  const { t } = useTranslation('pages.subscription');

  return [
    columnHelper.accessor('packageName', {
      id: 'packagePlanId',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('subscription_history.columns.package')}
        />
      ),
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),

    columnHelper.accessor('startDate', {
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('subscription_history.columns.start_date')}
        />
      ),
      cell: (info) => {
        const date = info.getValue();
        return format(new Date(date), 'MMM dd, yyyy');
      },
    }),

    columnHelper.accessor('endDate', {
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('subscription_history.columns.end_date')}
        />
      ),
      cell: (info) => {
        const date = info.getValue();
        return format(new Date(date), 'MMM dd, yyyy');
      },
    }),

    columnHelper.accessor('status', {
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('subscription_history.columns.status')}
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
          title={t('subscription_history.columns.auto_renewal')}
        />
      ),
      cell: (info) => (
        <Badge variant={info.getValue() ? 'default' : 'outline'}>
          {info.getValue()
            ? t('active_subscription.enabled')
            : t('active_subscription.disabled')}
        </Badge>
      ),
    }),

    columnHelper.display({
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('subscription_history.columns.actions')}
        />
      ),
      cell: ({ row }) => <SubscriptionsDataTableRowActions row={row} />,
      enableSorting: false,
      enableHiding: false,
    }),
  ];
};

export const subscriptionsColumns = [
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
      return format(new Date(date), 'MMM dd, yyyy');
    },
  }),

  columnHelper.accessor('endDate', {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End Date" />
    ),
    cell: (info) => {
      const date = info.getValue();
      return format(new Date(date), 'MMM dd, yyyy');
    },
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
    cell: ({ row }) => <SubscriptionsDataTableRowActions row={row} />,
    enableSorting: false,
    enableHiding: false,
  }),
];

export const createSubscriptionsColumns = (
  onAutoRenewalToggle?: (subscription: SubscriptionWithTimestamp) => void,
) => {
  // This is kept for backward compatibility with admin pages
  return subscriptionsColumns.map((column) => {
    if (column.id === 'actions') {
      return {
        ...column,
        cell: ({ row }: { row: { original: SubscriptionWithTimestamp } }) => (
          <SubscriptionsDataTableRowActions
            row={row}
            onAutoRenewalToggle={onAutoRenewalToggle}
          />
        ),
      };
    }
    return column;
  });
};

export const useCreateSubscriptionsColumns = (
  onAutoRenewalToggle?: (subscription: SubscriptionWithTimestamp) => void,
) => {
  const columns = useSubscriptionsColumns();

  return columns.map((column) => {
    if (column.id === 'actions') {
      return {
        ...column,
        cell: ({ row }: { row: { original: SubscriptionWithTimestamp } }) => (
          <SubscriptionsDataTableRowActions
            row={row}
            onAutoRenewalToggle={onAutoRenewalToggle}
          />
        ),
      };
    }
    return column;
  });
};
