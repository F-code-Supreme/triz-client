import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { BarChart, LineChart } from '@/components/ui/chart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { DashboardSection, ChartCard } from './dashboard-section';
import { PeriodFilter } from './period-filter';
import { StatCard } from './stat-card';

import type { DashboardData } from '../types';

interface GameSectionProps {
  data: DashboardData['games'];
}

export const GameSection = ({ data }: GameSectionProps) => {
  const [period, setPeriod] = useState<'day' | 'month' | 'quarter'>('day');

  const getFilteredData = () => {
    const allData = data.byPeriod;
    if (period === 'day') {
      return allData.slice(0, 30);
    } else if (period === 'month') {
      return allData.slice(30, 42);
    } else {
      return allData.slice(42);
    }
  };

  const filteredData = getFilteredData();

  const avgCompletionRate =
    data.gameStats.reduce((sum, game) => sum + game.completionRate, 0) /
    data.gameStats.length;

  const avgScore =
    data.gameStats.reduce((sum, game) => sum + game.averageScore, 0) /
    data.gameStats.length;

  return (
    <DashboardSection
      title="Game Analytics"
      description="Track game engagement, player performance, and popular games"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Game Plays"
          value={data.totalPlays.toLocaleString()}
          description="Across all games"
        />
        <StatCard
          title="Most Played Game"
          value={data.mostPlayed.name}
          description={`${data.mostPlayed.plays.toLocaleString()} plays`}
        />
        <StatCard
          title="Avg Completion Rate"
          value={`${avgCompletionRate.toFixed(1)}%`}
          description="Average across all games"
        />
        <StatCard
          title="Avg Score"
          value={avgScore.toFixed(0)}
          description="Average player score"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard
          title="Game Plays Over Time"
          description={`Total plays in the last ${period === 'day' ? '30 days' : period === 'month' ? '12 months' : '4 quarters'}`}
        >
          <div className="space-y-4">
            <div className="flex justify-end">
              <PeriodFilter value={period} onChange={setPeriod} />
            </div>
            <LineChart
              data={filteredData}
              xKey="period"
              lines={[
                {
                  dataKey: 'plays',
                  name: 'Plays',
                  stroke: '#8884d8',
                },
              ]}
              height={300}
            />
          </div>
        </ChartCard>

        <ChartCard
          title="Average Score Trend"
          description={`Average scores in the last ${period === 'day' ? '30 days' : period === 'month' ? '12 months' : '4 quarters'}`}
        >
          <div className="space-y-4">
            <div className="flex justify-end">
              <PeriodFilter value={period} onChange={setPeriod} />
            </div>
            <BarChart
              data={filteredData}
              xKey="period"
              bars={[
                { dataKey: 'averageScore', name: 'Avg Score', fill: '#ffc658' },
              ]}
              height={300}
            />
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="Top Players Leaderboard"
        description="Highest scoring players across all games"
      >
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead className="text-right">Games Played</TableHead>
                <TableHead className="text-right">Total Score</TableHead>
                <TableHead className="text-right">Avg per Game</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.topPlayers.map((player, index) => (
                <TableRow key={player.id}>
                  <TableCell className="font-medium">
                    {index === 0 && <Badge className="bg-yellow-500">🥇</Badge>}
                    {index === 1 && <Badge className="bg-gray-400">🥈</Badge>}
                    {index === 2 && <Badge className="bg-orange-600">🥉</Badge>}
                    {index > 2 && <span>{index + 1}</span>}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{player.avatar}</span>
                      <span className="font-medium">{player.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {player.gamesPlayed}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {player.score.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {Math.round(
                      player.score / player.gamesPlayed,
                    ).toLocaleString()}
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
