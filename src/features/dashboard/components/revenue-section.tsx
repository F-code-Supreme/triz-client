import { DashboardSection, ChartCard } from './dashboard-section';
import { StatCard } from './stat-card';
import { AreaChart, BarChart, PieChart } from '@/components/ui/chart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { DashboardData } from '../types';

interface RevenueSectionProps {
  data: DashboardData['revenue'];
}

export const RevenueSection = ({ data }: RevenueSectionProps) => {
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <DashboardSection
      title="Revenue & Course Packages"
      description="Track revenue trends, package performance, and transaction success rates"
    >
      {/* Stats Overview */}
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

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Revenue Trend - Area Chart */}
        <ChartCard
          title="Revenue Trend"
          description="Weekly revenue over the last 12 weeks"
        >
          <AreaChart
            data={data.byPeriod}
            xKey="period"
            areas={[{ dataKey: 'revenue', name: 'Revenue', fill: '#8884d8' }]}
            height={300}
          />
        </ChartCard>

        {/* Revenue by Package - Bar Chart */}
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

        {/* Purchases per Package - Pie Chart */}
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

        {/* Success Rate by Package - Bar Chart */}
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

      {/* Top Spenders Table */}
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
