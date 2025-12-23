import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  RevenueSection,
  // ChatForumSection,
  GameSection,
} from '@/features/dashboard';
import {
  useGetAdminPackageAnalyticsQuery,
  useGetAdminPaymentsRevenueTrendQuery,
  useGetAdminPaymentsStatsQuery,
  useGetAdminPaymentsStatusDistributionQuery,
  useGetAdminPaymentsTopUsersQuery,
  useGetAdminGameAnalyticsQuery,
} from '@/features/dashboard/services/queries';
import { GamesInfo } from '@/features/game/configs';
import { AdminLayout } from '@/layouts/admin-layout';
import { principlesData } from '@/pages/main/public/learn-triz/components/principles-data';

import type { DashboardData } from '@/features/dashboard/types';

const AdminDashboardPage = () => {
  const { t } = useTranslation('pages.admin');
  const [period, setPeriod] = useState<'day' | 'month' | 'quarter'>('day');

  const { data: paymentStatsStatistics, isLoading: statsLoading } =
    useGetAdminPaymentsStatsQuery();

  const { data: paymentRevenueTrend, isLoading: trendLoading } =
    useGetAdminPaymentsRevenueTrendQuery(period);

  const { data: paymentStatusDistribution, isLoading: distributionLoading } =
    useGetAdminPaymentsStatusDistributionQuery();

  const { data: topUsers, isLoading: topUsersLoading } =
    useGetAdminPaymentsTopUsersQuery();

  const { data: paymentAnalytics, isLoading: paymentAnalyticsLoading } =
    useGetAdminPackageAnalyticsQuery();

  const { data: gameAnalytics, isLoading: gameAnalyticsLoading } =
    useGetAdminGameAnalyticsQuery();

  const isInitialLoading =
    statsLoading ||
    distributionLoading ||
    topUsersLoading ||
    paymentAnalyticsLoading;

  // Transform game analytics data to match GameSection structure
  const transformedGameData: DashboardData['games'] = gameAnalytics
    ? {
        totalPlays: gameAnalytics.overview.totalPlays,
        // Map topGames to gameStats with principle data merged
        gameStats: gameAnalytics.topGames.map((game) => {
          // Find matching game config to get principle number
          const gameConfig = Object.values(GamesInfo).find(
            (config) => config.id === game.gameId,
          );
          const principle = gameConfig
            ? principlesData.find((p) => p.number === gameConfig.principle)
            : undefined;

          return {
            id: game.gameId,
            name: game.gameName,
            plays: game.totalPlays,
            averageScore: game.averageScore,
            completionRate: 0, // API doesn't provide this, set to 0 or calculate if needed
            averageTimePlay: 0, // API doesn't provide this, set to 0 or calculate if needed
            thumbnailUrl: game.thumbnailUrl,
            principleNumber: gameConfig?.principle,
            principleTitle: principle?.title,
            principleImage: principle?.image,
          };
        }),
        // Use scoreTrend for byPeriod data
        byPeriod: gameAnalytics.scoreTrend
          ? gameAnalytics.scoreTrend.map((trend) => ({
              period: trend.week,
              plays: 0, // API doesn't provide plays in trend
              averageScore: trend.averageScore || 0,
              completionRate: 0, // API doesn't provide this
            }))
          : [],
        // Map topPlayers to match expected structure
        topPlayers: gameAnalytics.topPlayers.map((player) => ({
          id: player.userId,
          name: player.userName,
          avatar: player.userAvatarUrl,
          score: player.totalScore,
          gamesPlayed: player.totalPlays,
        })),
        // Find most played game
        mostPlayed:
          gameAnalytics.topGames.length > 0
            ? {
                id: gameAnalytics.topGames[0].gameId,
                name: gameAnalytics.topGames[0].gameName,
                plays: gameAnalytics.topGames[0].totalPlays,
                averageScore: gameAnalytics.topGames[0].averageScore,
                completionRate: 0,
                averageTimePlay: 0,
              }
            : {
                id: '',
                name: '',
                plays: 0,
                averageScore: 0,
                completionRate: 0,
                averageTimePlay: 0,
              },
      }
    : {
        totalPlays: 0,
        gameStats: [],
        byPeriod: [],
        topPlayers: [],
        mostPlayed: {
          id: '',
          name: '',
          plays: 0,
          averageScore: 0,
          completionRate: 0,
          averageTimePlay: 0,
        },
      };

  const [activeTab, setActiveTab] = useState('revenue');

  return (
    <AdminLayout meta={{ title: t('dashboard.title') }}>
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
              {/* <TabsTrigger value="chat">{t('dashboard.tabs.chat')}</TabsTrigger> */}
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
              paymentAnalytics={paymentAnalytics}
              topUsers={topUsers}
              period={period}
              setPeriod={setPeriod}
              isLoading={isInitialLoading}
              trendLoading={trendLoading}
            />
          </TabsContent>
          {/* <TabsContent value="chat" className="mt-6">
            <ChatForumSection chat={mokdata.chat} isLoading={false} />
          </TabsContent> */}
          <TabsContent value="games" className="mt-6">
            <GameSection
              data={transformedGameData}
              isLoading={gameAnalyticsLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
