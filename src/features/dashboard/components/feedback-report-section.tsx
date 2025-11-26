import { DashboardSection, ChartCard } from './dashboard-section';
import { StatCard } from './stat-card';
import { BarChart, PieChart } from '@/components/ui/chart';
import type { DashboardData } from '../types';

interface FeedbackReportSectionProps {
  feedback: DashboardData['feedback'];
  reports: DashboardData['reports'];
}

export const FeedbackReportSection = ({
  feedback,
  reports,
}: FeedbackReportSectionProps) => {
  return (
    <DashboardSection
      title="Feedback & Reports"
      description="Track user satisfaction and reported issues"
    >
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Feedback"
          value={feedback.total.toLocaleString()}
          description="User feedback received"
        />
        <StatCard
          title="Average Rating"
          value={`${feedback.averageRating.toFixed(1)} / 5.0`}
          description="Overall satisfaction"
        />
        <StatCard
          title="Positive Feedback"
          value={`${((feedback.sentimentBreakdown.good / feedback.total) * 100).toFixed(1)}%`}
          description={`${feedback.sentimentBreakdown.good} good reviews`}
        />
        <StatCard
          title="Total Reports"
          value={reports.total.toLocaleString()}
          description="Issues reported by users"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Feedback Distribution - Bar Chart */}
        <ChartCard
          title="Feedback Rating Distribution"
          description="Number of feedback by star rating"
        >
          <BarChart
            data={feedback.distribution}
            xKey="rating"
            bars={[
              { dataKey: 'count', name: 'Feedback Count', fill: '#ffc658' },
            ]}
            height={300}
          />
        </ChartCard>

        {/* Sentiment Breakdown - Pie Chart */}
        <ChartCard
          title="Sentiment Analysis"
          description="Good, Medium, and Bad feedback distribution"
        >
          <PieChart
            data={[
              {
                name: 'Good (4-5 stars)',
                value: feedback.sentimentBreakdown.good,
              },
              {
                name: 'Medium (3 stars)',
                value: feedback.sentimentBreakdown.medium,
              },
              {
                name: 'Bad (1-2 stars)',
                value: feedback.sentimentBreakdown.bad,
              },
            ]}
            colors={['#82ca9d', '#ffc658', '#ff7c7c']}
            height={300}
          />
        </ChartCard>

        {/* Report Issues - Bar Chart */}
        <ChartCard
          title="Most Reported Issue Types"
          description="Distribution of reported issues by category"
        >
          <BarChart
            data={reports.byType}
            xKey="type"
            bars={[{ dataKey: 'count', name: 'Reports', fill: '#ff7c7c' }]}
            height={300}
          />
        </ChartCard>

        {/* Report Percentage - Pie Chart */}
        <ChartCard
          title="Issue Type Distribution"
          description="Percentage breakdown of issue categories"
        >
          <PieChart
            data={reports.byType.map((issue) => ({
              name: issue.type,
              value: issue.count,
            }))}
            height={300}
          />
        </ChartCard>
      </div>
    </DashboardSection>
  );
};
