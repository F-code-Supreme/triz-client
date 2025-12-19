import { useTranslation } from 'react-i18next';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { PieChart } from '@/components/ui/chart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatVND } from '@/utils';

import { DashboardSection, ChartCard } from './dashboard-section';
import {
  StatCardSkeleton,
  ChartCardSkeleton,
  TableCardSkeleton,
} from './skeleton-cards';
import { StatCard } from './stat-card';

import type {
  PackageAnalyticsItem,
  PaymentStats,
  PaymentStatusItem,
  RevenueTrendItem,
  TopUserItem,
} from '@/features/dashboard/services/queries/types';

interface RevenueSectionProps {
  paymentStatsStatistics: PaymentStats | undefined;
  paymentRevenueTrend: RevenueTrendItem[] | undefined;
  paymentStatusDistribution: PaymentStatusItem[] | undefined;
  topUsers: TopUserItem[] | undefined;
  paymentAnalytics: PackageAnalyticsItem[] | undefined;
  period: 'day' | 'month' | 'quarter';
  setPeriod: (period: 'day' | 'month' | 'quarter') => void;
  isLoading?: boolean;
  trendLoading?: boolean;
}

export const RevenueSection = ({
  paymentStatsStatistics,
  paymentRevenueTrend,
  paymentStatusDistribution,
  topUsers,
  paymentAnalytics,
  period,
  setPeriod,
  isLoading = false,
  trendLoading = false,
}: RevenueSectionProps) => {
  const { t } = useTranslation('pages.admin');

  const stats = paymentStatsStatistics ?? {
    totalRevenue: 0,
    totalTopupTransactions: 0,
    successRate: 0,
    successTransactions: 0,
    failureRate: 0,
    failedTransactions: 0,
  };

  const trend = Array.isArray(paymentRevenueTrend) ? paymentRevenueTrend : [];

  const distribution = Array.isArray(paymentStatusDistribution)
    ? paymentStatusDistribution
    : [];

  const analytics = Array.isArray(paymentAnalytics) ? paymentAnalytics : [];

  const users = Array.isArray(topUsers) ? topUsers : [];

  const getPeriodLabel = () => {
    if (period === 'day') return t('dashboard.revenue.period_30_days');
    if (period === 'month') return t('dashboard.revenue.period_12_months');
    return t('dashboard.revenue.period_4_quarters');
  };

  return (
    <DashboardSection
      title={t('dashboard.revenue.title')}
      description={t('dashboard.revenue.description')}
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title={t('dashboard.revenue.total_revenue')}
              value={formatVND(stats.totalRevenue)}
            />
            <StatCard
              title={t('dashboard.revenue.total_packages_sold')}
              value={(stats.totalTopupTransactions || 0).toLocaleString()}
            />
            <StatCard
              title={t('dashboard.revenue.success_rate')}
              value={`${stats.successRate ?? 0}%`}
              description={t('dashboard.revenue.success_transactions', {
                count: distribution[0]?.count ?? 0,
              })}
            />
            <StatCard
              title={t('dashboard.revenue.failure_rate')}
              value={`${stats.failureRate ?? 0}%`}
              description={t('dashboard.revenue.failed_transactions', {
                count: distribution[1]?.count ?? 0,
              })}
            />
          </>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {trendLoading ? (
          <ChartCardSkeleton />
        ) : (
          <ChartCard
            title={t('dashboard.revenue.revenue_trend')}
            description={t('dashboard.revenue.revenue_over_period', {
              period: getPeriodLabel(),
            })}
            period={period}
            onPeriodChange={setPeriod}
          >
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={370}>
                <BarChart data={trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="amountVND"
                    name={t('dashboard.revenue.total_revenue')}
                    fill="#003566"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        )}
        {isLoading ? (
          <ChartCardSkeleton />
        ) : (
          <ChartCard
            title={t('dashboard.revenue.purchases_distribution')}
            description={t('dashboard.revenue.purchases_distribution_desc')}
          >
            <PieChart
              data={distribution.map((pkg) => ({
                name: pkg?.status ?? 'Unknown',
                value: pkg?.count ?? 0,
              }))}
              height={400}
            />
          </ChartCard>
        )}
      </div>
      <div>
        {isLoading ? (
          <>
            <TableCardSkeleton />
          </>
        ) : (
          <ChartCard
            title={t('dashboard.revenue.top_spenders')}
            description={t('dashboard.revenue.top_spenders_desc')}
          >
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      {t('dashboard.revenue.rank')}
                    </TableHead>
                    <TableHead>{t('dashboard.revenue.name')}</TableHead>
                    <TableHead>{t('dashboard.revenue.email')}</TableHead>

                    <TableHead className="text-right">
                      {t('dashboard.revenue.total_spent')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user, index) => (
                    <TableRow key={user?.userId ?? index}>
                      <TableCell className="font-medium w-[100px]">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {user?.fullName ?? '—'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user?.email ?? '—'}
                      </TableCell>

                      <TableCell className="text-right font-semibold">
                        {formatVND(user?.totalAmount ?? 0)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ChartCard>
        )}
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Gói dịch vụ</h2>
            <p className="text-sm text-muted-foreground">
              Theo dõi xu hướng doanh thu, số lượng người dùng theo gói dịch vụ
            </p>
          </div>
          {/* {action && <div>{action}</div>} */}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {isLoading ? (
          <>
            <ChartCardSkeleton />
            <ChartCardSkeleton />
          </>
        ) : (
          <>
            <ChartCard
              title={'Thống kê trạng thái gói dịch vụ'}
              description={'Số lượng người dùng theo từng gói dịch vụ'}
            >
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={370}>
                  <BarChart data={analytics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="packagePlanName" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="activeSubscribers"
                      stackId="a"
                      fill="#003566"
                      name={'Số người dùng đang sử dụng'}
                    />
                    <Bar
                      dataKey="autoRenewCount"
                      stackId="a"
                      fill="#457b9d"
                      name={'Số người dùng đăng ký tự động'}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="Thống kê các gói dịch vụ"
              description="Phân bố số lượng token theo các gói"
            >
              <PieChart
                data={analytics.map((pkg) => ({
                  name: pkg?.packagePlanName ?? 'Unknown',
                  value: pkg?.totalTokensConsumed ?? 0,
                }))}
                height={400}
              />
              <Legend />
            </ChartCard>
          </>
        )}
      </div>
    </DashboardSection>
  );
};
