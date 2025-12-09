import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { AreaChart, BarChart, PieChart } from '@/components/ui/chart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { DashboardSection, ChartCard } from './dashboard-section';
import { PeriodFilter } from './period-filter';
import { StatCard } from './stat-card';

import type { DashboardData } from '../types';

interface RevenueSectionProps {
  data: DashboardData['revenue'];
}

export const RevenueSection = ({ data }: RevenueSectionProps) => {
  const { t } = useTranslation('pages.admin');
  const [period, setPeriod] = useState<'day' | 'month' | 'quarter'>('day');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const filteredData = useMemo(() => {
    if (period === 'day') {
      return data.byPeriod.slice(-30);
    } else if (period === 'month') {
      return data.byPeriod.slice(-17);
    } else {
      return data.byPeriod.slice(-4);
    }
  }, [data.byPeriod, period]);

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
        <StatCard
          title={t('dashboard.revenue.total_revenue')}
          value={formatCurrency(data.total)}
          trend={{ value: data.growth, isPositive: true }}
        />
        <StatCard
          title={t('dashboard.revenue.total_packages_sold')}
          value={data.transactions.total.toLocaleString()}
          description={t('dashboard.revenue.packages_sold_desc')}
        />
        <StatCard
          title={t('dashboard.revenue.success_rate')}
          value={`${data.transactions.successRate}%`}
          description={t('dashboard.revenue.success_transactions', {
            count: data.transactions.success,
          })}
        />
        <StatCard
          title={t('dashboard.revenue.failure_rate')}
          value={`${data.transactions.failureRate}%`}
          description={t('dashboard.revenue.failed_transactions', {
            count: data.transactions.failed,
          })}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard
          title={t('dashboard.revenue.revenue_trend')}
          description={t('dashboard.revenue.revenue_over_period', {
            period: getPeriodLabel(),
          })}
        >
          <div className="space-y-4">
            <div className="flex justify-end">
              <PeriodFilter value={period} onChange={setPeriod} />
            </div>
            <AreaChart
              data={filteredData}
              xKey="period"
              areas={[
                {
                  dataKey: 'revenue',
                  name: t('dashboard.revenue.total_revenue'),
                  fill: '#8884d8',
                },
              ]}
              height={300}
            />
          </div>
        </ChartCard>

        <ChartCard
          title={t('dashboard.revenue.revenue_by_package')}
          description={t('dashboard.revenue.revenue_by_package_desc')}
        >
          <BarChart
            data={data.byPackage}
            xKey="name"
            bars={[
              {
                dataKey: 'revenue',
                name: t('dashboard.revenue.total_revenue'),
                fill: '#8884d8',
              },
            ]}
            height={300}
          />
        </ChartCard>

        <ChartCard
          title={t('dashboard.revenue.purchases_distribution')}
          description={t('dashboard.revenue.purchases_distribution_desc')}
        >
          <PieChart
            data={data.byPackage.map((pkg) => ({
              name: pkg.name,
              value: pkg.purchases,
            }))}
            height={300}
          />
        </ChartCard>

        <ChartCard
          title={t('dashboard.revenue.success_rate_by_package')}
          description={t('dashboard.revenue.success_rate_by_package_desc')}
        >
          <BarChart
            data={data.byPackage}
            xKey="name"
            bars={[
              {
                dataKey: 'successRate',
                name: `${t('dashboard.revenue.success_rate')} (%)`,
                fill: '#82ca9d',
              },
            ]}
            height={300}
          />
        </ChartCard>
      </div>

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
                  {t('dashboard.revenue.purchases')}
                </TableHead>
                <TableHead className="text-right">
                  {t('dashboard.revenue.total_spent')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.topSpenders.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-right">{user.purchases}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(user.totalSpent)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ChartCard>
    </DashboardSection>
  );
};
