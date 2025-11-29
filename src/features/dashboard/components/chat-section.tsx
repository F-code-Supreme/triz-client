import { PieChart } from '@/components/ui/chart';

import { DashboardSection, ChartCard } from './dashboard-section';
import { StatCard } from './stat-card';

import type { DashboardData } from '../types';

interface ChatForumSectionProps {
  chat: DashboardData['chat'];
}

export const ChatForumSection = ({ chat }: ChatForumSectionProps) => {
  return (
    <DashboardSection
      title="Chat Analytics"
      description="Monitor chat bot performance"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Messages"
          value={chat.totalMessages.toLocaleString()}
          description={`${chat.userMessages.toLocaleString()} user, ${chat.botMessages.toLocaleString()} bot`}
        />
        <StatCard
          title="Bot Satisfaction"
          value={`${chat.satisfactionRating.toFixed(1)} / 5.0`}
          description={`Avg response: ${chat.averageResponseTime}s`}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard
          title="Chat Message Distribution"
          description="User messages vs bot responses"
        >
          <PieChart
            data={[
              { name: 'User Messages', value: chat.userMessages },
              { name: 'Bot Messages', value: chat.botMessages },
            ]}
            colors={['#8884d8', '#82ca9d']}
            height={300}
          />
        </ChartCard>

        <ChartCard
          title="Chat Bot Satisfaction"
          description="User satisfaction with bot responses"
        >
          <PieChart
            data={[
              {
                name: 'Satisfied',
                value: chat.satisfactionBreakdown.satisfied,
              },
              { name: 'Neutral', value: chat.satisfactionBreakdown.neutral },
              {
                name: 'Unsatisfied',
                value: chat.satisfactionBreakdown.unsatisfied,
              },
            ]}
            colors={['#82ca9d', '#ffc658', '#ff7c7c']}
            height={300}
          />
        </ChartCard>
      </div>
    </DashboardSection>
  );
};
