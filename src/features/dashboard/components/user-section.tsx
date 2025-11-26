import { DashboardSection } from './dashboard-section';
import { StatCard } from './stat-card';
import type { DashboardData } from '../types';

interface UserSectionProps {
  data: DashboardData['users'];
}

export const UserSection = ({ data }: UserSectionProps) => {
  return (
    <DashboardSection
      title="User Analytics"
      description="Monitor user growth and engagement metrics"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={data.total.toLocaleString()}
          trend={{ value: data.growth, isPositive: true }}
        />
        <StatCard
          title="New Users"
          value={data.new.toLocaleString()}
          description="Registered this period"
        />
        <StatCard
          title="Active Users"
          value={data.active.toLocaleString()}
          description={`${((data.active / data.total) * 100).toFixed(1)}% of total`}
        />
        <StatCard
          title="Engagement Rate"
          value={`${((data.active / data.total) * 100).toFixed(1)}%`}
          description="Active vs total users"
        />
      </div>
    </DashboardSection>
  );
};
