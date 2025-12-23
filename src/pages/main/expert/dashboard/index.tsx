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
import { assignmentSubmissionStatusLabels } from '@/features/assignment/utils';
import {
  ChartCard,
  DashboardSection,
  StatCard,
  StatCardSkeleton,
  ChartCardSkeleton,
} from '@/features/dashboard';
import { useGetExpertAnalyticsQuery } from '@/features/dashboard/services/queries';
import { reviewStatusLabels } from '@/features/journal-review/utils/status';
import { ExpertLayout } from '@/layouts/expert-layout';

import type { AssignmentSubmissionStatus } from '@/features/assignment/types';
import type { ReviewStatus } from '@/features/journal-review/types';

const ExpertDashboardPage = () => {
  const { t } = useTranslation('pages.expert');
  const { data: expertAnalytics, isLoading } = useGetExpertAnalyticsQuery();

  const stats = expertAnalytics ?? {
    totalSubmissions: 0,
    pendingGradingCount: 0,
    gradedCount: 0,
    passedPercentage: 0,
    submissionStatusDistribution: {},
    totalProblemReviews: 0,
    pendingReviewsCount: 0,
    completedReviewsCount: 0,
    reviewStatusDistribution: {},
    recentSubmissionTrend: [],
  };

  const submissionStatusData = Object.entries(
    stats.submissionStatusDistribution || {},
  ).map(([status, count]) => ({
    name: assignmentSubmissionStatusLabels[
      status as AssignmentSubmissionStatus
    ],
    value: count as number,
  }));

  const reviewStatusData = Object.entries(stats.reviewStatusDistribution || {})
    .filter(([status]) => status !== 'COMMENTED')
    .map(([status, count]) => ({
      name: reviewStatusLabels[status as ReviewStatus],
      value: count as number,
    }));

  const trendData = Array.isArray(stats.recentSubmissionTrend)
    ? stats.recentSubmissionTrend
    : [];

  return (
    <ExpertLayout meta={{ title: t('dashboard.title') }}>
      <div className="space-y-8 p-6">
        {/* Assignment Submissions Section */}
        <DashboardSection
          title={t('dashboard.assignments.title')}
          description={t('dashboard.assignments.description')}
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
                  title={t('dashboard.assignments.total_submissions')}
                  value={stats.totalSubmissions.toLocaleString()}
                  description={t(
                    'dashboard.assignments.total_submissions_desc',
                  )}
                />
                <StatCard
                  title={t('dashboard.assignments.pending_grading')}
                  value={stats.pendingGradingCount.toLocaleString()}
                  description={t('dashboard.assignments.pending_grading_desc')}
                />
                <StatCard
                  title={t('dashboard.assignments.graded')}
                  value={stats.gradedCount.toLocaleString()}
                  description={t('dashboard.assignments.graded_desc')}
                />
                <StatCard
                  title={t('dashboard.assignments.pass_rate')}
                  value={`${stats.passedPercentage}%`}
                  description={t('dashboard.assignments.pass_rate_desc')}
                />
              </>
            )}
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
                  title={t('dashboard.assignments.submission_trend')}
                  description={t('dashboard.assignments.submission_trend_desc')}
                >
                  {trendData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={370}>
                      <BarChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="count"
                          name={t('dashboard.assignments.submissions')}
                          fill="#003566"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[370px] text-muted-foreground">
                      {t('dashboard.assignments.no_data')}
                    </div>
                  )}
                </ChartCard>
                <ChartCard
                  title={t(
                    'dashboard.assignments.submission_status_distribution',
                  )}
                  description={t(
                    'dashboard.assignments.submission_status_distribution_desc',
                  )}
                >
                  {submissionStatusData.length > 0 ? (
                    <PieChart data={submissionStatusData} height={400} />
                  ) : (
                    <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                      {t('dashboard.assignments.no_data')}
                    </div>
                  )}
                </ChartCard>
              </>
            )}
          </div>
        </DashboardSection>

        {/* Problem Reviews Section */}
        <DashboardSection
          title={t('dashboard.reviews.title')}
          description={t('dashboard.reviews.description')}
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : (
              <>
                <StatCard
                  title={t('dashboard.reviews.total_reviews')}
                  value={stats.totalProblemReviews.toLocaleString()}
                  description={t('dashboard.reviews.total_reviews_desc')}
                />
                <StatCard
                  title={t('dashboard.reviews.pending_reviews')}
                  value={stats.pendingReviewsCount.toLocaleString()}
                  description={t('dashboard.reviews.pending_reviews_desc')}
                />
                <StatCard
                  title={t('dashboard.reviews.completed_reviews')}
                  value={stats.completedReviewsCount.toLocaleString()}
                  description={t('dashboard.reviews.completed_reviews_desc')}
                />
              </>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-1">
            {isLoading ? (
              <ChartCardSkeleton />
            ) : (
              <ChartCard
                title={t('dashboard.reviews.review_status_distribution')}
                description={t(
                  'dashboard.reviews.review_status_distribution_desc',
                )}
              >
                {reviewStatusData.length > 0 ? (
                  <PieChart data={reviewStatusData} height={400} />
                ) : (
                  <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                    {t('dashboard.reviews.no_data')}
                  </div>
                )}
              </ChartCard>
            )}
          </div>
        </DashboardSection>
      </div>
    </ExpertLayout>
  );
};

export default ExpertDashboardPage;
