import { DashboardSection, ChartCard } from './dashboard-section';
import { StatCard } from './stat-card';
import { PieChart, LineChart } from '@/components/ui/chart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { DashboardData } from '../types';

interface ChatForumSectionProps {
  chat: DashboardData['chat'];
  forum: DashboardData['forum'];
}

export const ChatForumSection = ({ chat, forum }: ChatForumSectionProps) => {
  return (
    <DashboardSection
      title="Chat & Forum Analytics"
      description="Monitor chat bot performance and forum engagement"
    >
      {/* Stats Overview */}
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
        <StatCard
          title="Total Forum Posts"
          value={forum.totalPosts.toLocaleString()}
          description={`${forum.totalComments.toLocaleString()} comments`}
        />
        <StatCard
          title="Active Forum Users"
          value={forum.activeUsers.toLocaleString()}
          description={`${forum.totalVotes.toLocaleString()} total votes`}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Chat Message Distribution - Pie Chart */}
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

        {/* Chat Satisfaction - Pie Chart */}
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

        {/* Forum Engagement Stats */}
        <ChartCard
          title="Forum Engagement Overview"
          description="Posts, comments, and votes distribution"
        >
          <PieChart
            data={[
              { name: 'Posts', value: forum.totalPosts },
              { name: 'Comments', value: forum.totalComments },
              { name: 'Votes', value: forum.totalVotes },
            ]}
            height={300}
          />
        </ChartCard>

        {/* Top Posts Engagement Trend */}
        <ChartCard
          title="Top Posts Engagement"
          description="Votes vs comments for trending posts"
        >
          <LineChart
            data={forum.topPosts.slice(0, 5)}
            xKey="title"
            lines={[
              { dataKey: 'votes', name: 'Votes', stroke: '#8884d8' },
              { dataKey: 'comments', name: 'Comments', stroke: '#82ca9d' },
            ]}
            height={300}
          />
        </ChartCard>
      </div>

      {/* Top Forum Posts Table */}
      <ChartCard
        title="Top Forum Posts"
        description="Most voted and discussed posts this period"
      >
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Rank</TableHead>
                <TableHead>Post Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead className="text-right">Votes</TableHead>
                <TableHead className="text-right">Comments</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forum.topPosts.map((post, index) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">
                    {index < 3 ? (
                      <Badge variant="secondary">{index + 1}</Badge>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium max-w-md truncate">
                    {post.title}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {post.author}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="font-mono">
                      ↑ {post.votes}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="font-mono">
                      💬 {post.comments}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-xs">
                    {new Date(post.createdAt).toLocaleDateString()}
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
