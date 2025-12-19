import { useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import { AdminDashboardQueryKeys } from '@/features/dashboard/services/queries/keys';

import type {
  PackageAnalyticsItem,
  PaymentStats,
  PaymentStatusItem,
  RevenueTrendItem,
  TopUserItem,
} from '@/features/dashboard/services/queries/types';

export const useGetAdminPaymentsStatsQuery = () => {
  const _request = useAxios();
  return useQuery({
    queryKey: [AdminDashboardQueryKeys.GetPaymentStats],
    queryFn: async () => {
      const response = await _request.get<PaymentStats>(
        '/dashboard/payments/stats',
      );
      return response.data;
    },
  });
};
export const useGetAdminPaymentsRevenueTrendQuery = (time: string) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [AdminDashboardQueryKeys.GetRevenueTrendItems, time],
    queryFn: async () => {
      const response = await _request.get<RevenueTrendItem[]>(
        `/dashboard/payments/revenue-trend?period=${time}`,
      );
      return response.data;
    },
  });
};
export const useGetAdminPaymentsStatusDistributionQuery = () => {
  const _request = useAxios();
  return useQuery({
    queryKey: [AdminDashboardQueryKeys.GetPaymentStatusItems],
    queryFn: async () => {
      const response = await _request.get<PaymentStatusItem[]>(
        `dashboard/payments/status-distribution`,
      );
      return response.data;
    },
  });
};
export const useGetAdminPaymentsTopUsersQuery = () => {
  const _request = useAxios();
  return useQuery({
    queryKey: [AdminDashboardQueryKeys.GetTopUserItems],
    queryFn: async () => {
      const response = await _request.get<TopUserItem[]>(
        `dashboard/payments/top-users?limit=6`,
      );
      return response.data;
    },
  });
};
export const useGetAdminPackageAnalyticsQuery = () => {
  const _request = useAxios();
  return useQuery({
    queryKey: [AdminDashboardQueryKeys.GetPackageAnalyticsItems],
    queryFn: async () => {
      const response = await _request.get<PackageAnalyticsItem[]>(
        `dashboard/packages/analytics`,
      );
      return response.data;
    },
  });
};
