import { Link } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { DataTableColumnHeader } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatDate } from '@/utils';

import { AdminSubscriptionsDataTableRowActions } from './admin-subscriptions-data-table-row-actions';
import {
  getAdminSubscriptionStatusLabel,
  getSubscriptionStatusColor,
} from '../utils/status';

import type { Subscription } from '../types';
import type { DataTimestamp } from '@/types';

type SubscriptionWithTimestamp = Subscription & DataTimestamp;

const columnHelper = createColumnHelper<SubscriptionWithTimestamp>();

export const useAdminSubscriptionsColumns = () => {
  const { t } = useTranslation('pages.admin');

  return useMemo(
    () => [
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
          return <span>{formatDate(new Date(date))}</span>;
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
          return <span>{formatDate(new Date(date))}</span>;
        },
      }),

      columnHelper.accessor('tokensPerDayRemaining', {
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t('subscriptions.columns.trizilium_per_day')}
          />
        ),
        cell: (info) => (
          <span className="font-semibold">{info.getValue()}</span>
        ),
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
          const label = getAdminSubscriptionStatusLabel(status, t);
          return <Badge className={colors}>{label}</Badge>;
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
    ],
    [t],
  );
};

export const useCreateAdminSubscriptionsColumns = (
  onAutoRenewalToggle?: (subscription: SubscriptionWithTimestamp) => void,
) => {
  const columns = useAdminSubscriptionsColumns();

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
