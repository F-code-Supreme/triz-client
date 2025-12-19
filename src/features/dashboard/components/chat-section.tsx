import { useTranslation } from 'react-i18next';

import { PieChart } from '@/components/ui/chart';

import { DashboardSection, ChartCard } from './dashboard-section';
import { StatCardSkeleton, ChartCardSkeleton } from './skeleton-cards';
import { StatCard } from './stat-card';

import type { DashboardData } from '../types';

interface ChatForumSectionProps {
  chat: DashboardData['chat'];
  isLoading?: boolean;
}

export const ChatForumSection = ({
  chat,
  isLoading = false,
}: ChatForumSectionProps) => {
  const { t } = useTranslation('pages.admin');

  return (
    <DashboardSection
      title={t('dashboard.chat.title')}
      description={t('dashboard.chat.description')}
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title={t('dashboard.chat.total_messages')}
              value={chat.totalMessages.toLocaleString()}
              description={t('dashboard.chat.user_bot_messages', {
                user: chat.userMessages.toLocaleString(),
                bot: chat.botMessages.toLocaleString(),
              })}
            />
            <StatCard
              title={t('dashboard.chat.bot_satisfaction')}
              value={`${chat.satisfactionRating.toFixed(1)} / 5.0`}
              description={t('dashboard.chat.avg_response', {
                time: chat.averageResponseTime,
              })}
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
              title={t('dashboard.chat.message_distribution')}
              description={t('dashboard.chat.message_distribution_desc')}
            >
              <PieChart
                data={[
                  {
                    name: t('dashboard.chat.user_messages'),
                    value: chat.userMessages,
                  },
                  {
                    name: t('dashboard.chat.bot_messages'),
                    value: chat.botMessages,
                  },
                ]}
                colors={['#8884d8', '#82ca9d']}
                height={300}
              />
            </ChartCard>

            <ChartCard
              title={t('dashboard.chat.satisfaction_title')}
              description={t('dashboard.chat.satisfaction_desc')}
            >
              <PieChart
                data={[
                  {
                    name: t('dashboard.chat.satisfied'),
                    value: chat.satisfactionBreakdown.satisfied,
                  },
                  {
                    name: t('dashboard.chat.neutral'),
                    value: chat.satisfactionBreakdown.neutral,
                  },
                  {
                    name: t('dashboard.chat.unsatisfied'),
                    value: chat.satisfactionBreakdown.unsatisfied,
                  },
                ]}
                colors={['#82ca9d', '#ffc658', '#ff7c7c']}
                height={300}
              />
            </ChartCard>
          </>
        )}
      </div>
    </DashboardSection>
  );
};
