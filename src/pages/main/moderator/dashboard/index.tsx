import { useTranslation } from 'react-i18next';

import { PieChart } from '@/components/ui/chart';
import {
  ChartCard,
  DashboardSection,
  StatCard,
  StatCardSkeleton,
  ChartCardSkeleton,
} from '@/features/dashboard';
import { useGetForumAnalyticsQuery } from '@/features/dashboard/services/queries';
import { forumPostStatusLabels } from '@/features/forum/utils';
import { ModeratorLayout } from '@/layouts/moderator-layout';

import type { ForumPostStatus } from '@/features/forum/types';

const ModeratorDashboardPage = () => {
  const { t } = useTranslation('pages.moderator');
  const { data: forumAnalytics, isLoading } = useGetForumAnalyticsQuery();

  const stats = forumAnalytics ?? {
    totalPosts: 0,
    totalReplies: 0,
    totalReposts: 0,
    pendingReports: 0,
    postStatusDistribution: {},
  };

  const statusDistributionData = Object.entries(
    stats.postStatusDistribution || {},
  ).map(([status, count]) => ({
    name: forumPostStatusLabels[status as ForumPostStatus],
    value: count as number,
  }));

  return (
    <ModeratorLayout meta={{ title: t('dashboard.title') }}>
      <div className="space-y-8 p-6">
        <DashboardSection
          title={t('dashboard.title')}
          description={t('dashboard.description')}
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
                  title={t('dashboard.total_posts')}
                  value={stats.totalPosts.toLocaleString()}
                  description={t('dashboard.total_posts_desc')}
                />
                <StatCard
                  title={t('dashboard.total_replies')}
                  value={stats.totalReplies.toLocaleString()}
                  description={t('dashboard.total_replies_desc')}
                />
                <StatCard
                  title={t('dashboard.total_reposts')}
                  value={stats.totalReposts.toLocaleString()}
                  description={t('dashboard.total_reposts_desc')}
                />
                <StatCard
                  title={t('dashboard.pending_reports')}
                  value={stats.pendingReports.toLocaleString()}
                  description={t('dashboard.pending_reports_desc')}
                />
              </>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-1">
            {isLoading ? (
              <ChartCardSkeleton />
            ) : (
              <ChartCard
                title={t('dashboard.post_status_distribution')}
                description={t('dashboard.post_status_distribution_desc')}
              >
                {statusDistributionData.length > 0 ? (
                  <PieChart data={statusDistributionData} height={400} />
                ) : (
                  <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                    {t('dashboard.no_data')}
                  </div>
                )}
              </ChartCard>
            )}
          </div>
        </DashboardSection>
      </div>
    </ModeratorLayout>
  );
};

export default ModeratorDashboardPage;
