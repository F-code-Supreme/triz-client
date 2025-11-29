import { useState, useMemo } from 'react';

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

  return (
    <DashboardSection
      title="Revenue & Course Packages"
      description="Track revenue trends, package performance, and transaction success rates"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(data.total)}
          trend={{ value: data.growth, isPositive: true }}
        />
        <StatCard
          title="Total Packages Sold"
          value={data.transactions.total.toLocaleString()}
          description="Across all package types"
        />
        <StatCard
          title="Success Rate"
          value={`${data.transactions.successRate}%`}
          description={`${data.transactions.success} successful transactions`}
        />
        <StatCard
          title="Failure Rate"
          value={`${data.transactions.failureRate}%`}
          description={`${data.transactions.failed} failed transactions`}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard
          title="Revenue Trend"
          description={`Revenue over the last ${period === 'day' ? '30 days' : period === 'month' ? '12 months' : '4 quarters'}`}
        >
          <div className="space-y-4">
            <div className="flex justify-end">
              <PeriodFilter value={period} onChange={setPeriod} />
            </div>
            <AreaChart
              data={filteredData}
              xKey="period"
              areas={[{ dataKey: 'revenue', name: 'Revenue', fill: '#8884d8' }]}
              height={300}
            />
          </div>
        </ChartCard>

        <ChartCard
          title="Revenue by Package"
          description="Total revenue generated per package type"
        >
          <BarChart
            data={data.byPackage}
            xKey="name"
            bars={[{ dataKey: 'revenue', name: 'Revenue', fill: '#8884d8' }]}
            height={300}
          />
        </ChartCard>

        <ChartCard
          title="Purchases Distribution"
          description="Number of purchases by package type"
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
          title="Success Rate by Package"
          description="Transaction success rate per package"
        >
          <BarChart
            data={data.byPackage}
            xKey="name"
            bars={[
              {
                dataKey: 'successRate',
                name: 'Success Rate (%)',
                fill: '#82ca9d',
              },
            ]}
            height={300}
          />
        </ChartCard>
      </div>

      <ChartCard
        title="Top Users by Spending"
        description="Users with the highest total spending"
      >
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Rank</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Purchases</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
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
