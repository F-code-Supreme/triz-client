import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import FallbackLoading from '@/components/fallback-loading';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  RevenueSection,
  ChatForumSection,
  mockDashboardData,
  GameSection,
} from '@/features/dashboard';
import {
  useGetAdminPaymentsRevenueTrendQuery,
  useGetAdminPaymentsStatsQuery,
  useGetAdminPaymentsStatusDistributionQuery,
  useGetAdminPaymentsTopUsersQuery,
} from '@/features/dashboard/services/queries';
import { AdminLayout } from '@/layouts/admin-layout';

const AdminDashboardPage = () => {
  const { t } = useTranslation('pages.admin');
  const [period, setPeriod] = useState<'day' | 'month' | 'quarter'>('day');
  const mokdata = mockDashboardData;

  const { data: paymentStatsStatistics, isLoading: statsLoading } =
    useGetAdminPaymentsStatsQuery();

  const { data: paymentRevenueTrend, isLoading: trendLoading } =
    useGetAdminPaymentsRevenueTrendQuery(period);

  const { data: paymentStatusDistribution, isLoading: distributionLoading } =
    useGetAdminPaymentsStatusDistributionQuery();

  const { data: topUsers, isLoading: topUsersLoading } =
    useGetAdminPaymentsTopUsersQuery();

  const isLoading =
    statsLoading || trendLoading || distributionLoading || topUsersLoading;

  const [activeTab, setActiveTab] = useState('revenue');

  return (
    <AdminLayout meta={{ title: t('dashboard.title') }}>
      {isLoading && <FallbackLoading isFullscreen isCenter />}
      <div className="space-y-8 p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                {t('dashboard.title')}
              </h1>
              <p className="text-muted-foreground">
                {t('dashboard.description')}
              </p>
            </div>
            <TabsList>
              <TabsTrigger value="revenue">
                {t('dashboard.tabs.revenue')}
              </TabsTrigger>
              <TabsTrigger value="chat">{t('dashboard.tabs.chat')}</TabsTrigger>
              <TabsTrigger value="games">
                {t('dashboard.tabs.games')}
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="revenue" className="mt-6">
            <RevenueSection
              paymentStatsStatistics={paymentStatsStatistics}
              paymentRevenueTrend={paymentRevenueTrend}
              paymentStatusDistribution={paymentStatusDistribution}
              topUsers={topUsers}
              period={period}
              setPeriod={setPeriod}
            />
          </TabsContent>
          <TabsContent value="chat" className="mt-6">
            <ChatForumSection chat={mokdata.chat} />
          </TabsContent>
          <TabsContent value="games" className="mt-6">
            <GameSection data={mokdata.games} />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
