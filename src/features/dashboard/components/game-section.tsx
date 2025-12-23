import { BookOpen } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// import { AsyncSelect } from '@/components/ui/async-select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BarChart } from '@/components/ui/chart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { DashboardSection, ChartCard } from './dashboard-section';
// import { PeriodFilter } from './period-filter';
import {
  StatCardSkeleton,
  ChartCardSkeleton,
  TableCardSkeleton,
} from './skeleton-cards';
import { StatCard } from './stat-card';

import type { DashboardData } from '../types';

interface GameSectionProps {
  data: DashboardData['games'];
  isLoading?: boolean;
}

export const GameSection = ({ data, isLoading = false }: GameSectionProps) => {
  const { t } = useTranslation('pages.admin');
  const [period, _] = useState<'day' | 'month' | 'quarter'>('day');
  // const [selectedGame, setSelectedGame] = useState<string>('overview');

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

  // const avgCompletionRate =
  //   data.gameStats.reduce((sum, game) => sum + game.completionRate, 0) /
  //   data.gameStats.length;

  const avgScore =
    data.gameStats.reduce((sum, game) => sum + game.averageScore, 0) /
    data.gameStats.length;

  // const avgTimePlay =
  //   data.gameStats.reduce((sum, game) => sum + game.averageTimePlay, 0) /
  //   data.gameStats.length;

  const getPeriodLabel = () => {
    if (period === 'day') return t('dashboard.games.period_30_days');
    if (period === 'month') return t('dashboard.games.period_12_months');
    return t('dashboard.games.period_4_quarters');
  };

  // Get selected game details
  // const selectedGameData = data.gameStats.find((g) => g.id === selectedGame);

  // Fetcher function for AsyncSelect
  // const fetchGames = async (query?: string): Promise<GameStats[]> => {
  //   // Simulate async behavior (immediate return since data is local)
  //   await new Promise((resolve) => setTimeout(resolve, 0));

  //   const allGames: GameStats[] = [
  //     {
  //       id: 'overview',
  //       name: t('dashboard.games.overview_all_games'),
  //       plays: data.totalPlays,
  //       averageScore: avgScore,
  //       completionRate: avgCompletionRate,
  //       averageTimePlay: avgTimePlay,
  //     },
  //     ...data.gameStats,
  //   ];

  //   if (!query) return allGames;

  //   const searchQuery = query.toLowerCase();
  //   return allGames.filter((game) =>
  //     game.name.toLowerCase().includes(searchQuery),
  //   );
  // };

  // Filter function for local filtering when using preload
  // const filterGame = (game: GameStats, query: string): boolean => {
  //   const searchQuery = query.toLowerCase();
  //   return game.name.toLowerCase().includes(searchQuery);
  // };

  return (
    <DashboardSection
      title={t('dashboard.games.title')}
      description={t('dashboard.games.description')}
      // action={
      //   <AsyncSelect<GameStats>
      //     fetcher={fetchGames}
      //     preload
      //     filterFn={filterGame}
      //     renderOption={(n) => (
      //       <div className="flex items-center gap-3">
      //         {n.principleImage && n.id !== 'overview' && (
      //           <img
      //             src={n.principleImage}
      //             alt={n.principleTitle || 'Principle'}
      //             className="w-8 h-8 object-cover rounded"
      //           />
      //         )}
      //         <div className="flex flex-col">
      //           <div className="font-medium">{n.name}</div>
      //           {n.principleTitle && n.id !== 'overview' && (
      //             <div className="text-xs text-muted-foreground">
      //               {n.principleTitle}
      //             </div>
      //           )}
      //         </div>
      //       </div>
      //     )}
      //     width={250}
      //     getOptionValue={(n) => n.id}
      //     getDisplayValue={(n) => n.name}
      //     label={t('dashboard.games.select_view')}
      //     value={selectedGame}
      //     onChange={setSelectedGame}
      //   />
      // }
    >
      {/* Overview Statistics */}
      {isLoading ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCardSkeleton />
            <StatCardSkeleton />
            {/* <StatCardSkeleton /> */}
            {/* <StatCardSkeleton /> */}
          </div>
        </div>
      ) : (
        <>
          {/* {selectedGame === 'overview' && ( */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {t('dashboard.games.overview_all_games')}
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <StatCard
                title={t('dashboard.games.total_game_plays')}
                value={data.totalPlays.toLocaleString()}
                description={t('dashboard.games.total_plays_desc')}
              />
              {/* <StatCard
                  title={t('dashboard.games.avg_time_play')}
                  value={`${avgTimePlay.toFixed(1)} ${t('dashboard.games.minutes')}`}
                  description={t('dashboard.games.avg_time_all_games')}
                />
                <StatCard
                  title={t('dashboard.games.avg_completion_rate')}
                  value={`${avgCompletionRate.toFixed(1)}%`}
                  description={t('dashboard.games.avg_completion_all_games')}
                /> */}
              <StatCard
                title={t('dashboard.games.avg_score')}
                value={avgScore.toFixed(0)}
                description={t('dashboard.games.avg_player_score')}
              />
            </div>
          </div>
          {/* )} */}

          {/* {selectedGame !== 'overview' && selectedGameData && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                {selectedGameData.principleImage && (
                  <img
                    src={selectedGameData.principleImage}
                    alt={selectedGameData.principleTitle || 'Game principle'}
                    className="w-24 h-24 object-cover rounded-lg shadow-md"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {selectedGameData.name}
                  </h3>
                  {selectedGameData.principleNumber &&
                    selectedGameData.principleTitle && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Nguyên tắc #{selectedGameData.principleNumber}:{' '}
                        {selectedGameData.principleTitle}
                      </p>
                    )}
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  title={t('dashboard.games.total_games_play')}
                  value={selectedGameData.plays.toLocaleString()}
                  description={t('dashboard.games.total_plays_game')}
                />
                <StatCard
                  title={t('dashboard.games.avg_time_play')}
                  value={`${selectedGameData.averageTimePlay.toFixed(1)} ${t('dashboard.games.minutes')}`}
                  description={t('dashboard.games.avg_time_per_game')}
                />
                <StatCard
                  title={t('dashboard.games.completion_rate')}
                  value={`${selectedGameData.completionRate.toFixed(1)}%`}
                  description={t('dashboard.games.players_complete')}
                />
                <StatCard
                  title={t('dashboard.games.avg_score')}
                  value={selectedGameData.averageScore.toFixed(0)}
                  description={t('dashboard.games.avg_score_game')}
                />
              </div>
            </div>
          )} */}
        </>
      )}

      <div className="grid gap-4">
        {isLoading ? (
          <>
            <ChartCardSkeleton />
            {/* <ChartCardSkeleton /> */}
          </>
        ) : (
          <>
            {/* <ChartCard
              title={t('dashboard.games.plays_over_time')}
              description={t('dashboard.games.total_plays_period', {
                period: getPeriodLabel(),
              })}
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
                      name: t('dashboard.games.plays'),
                      stroke: '#8884d8',
                    },
                  ]}
                  height={300}
                />
              </div>
            </ChartCard> */}

            <ChartCard
              title={t('dashboard.games.avg_score_trend')}
              description={t('dashboard.games.avg_scores_period', {
                period: getPeriodLabel(),
              })}
            >
              <div className="space-y-4">
                <BarChart
                  data={filteredData}
                  xKey="period"
                  bars={[
                    {
                      dataKey: 'averageScore',
                      name: t('dashboard.games.avg_score_label'),
                      fill: '#ffc658',
                    },
                  ]}
                  height={300}
                />
              </div>
            </ChartCard>
          </>
        )}
      </div>

      {isLoading ? (
        <TableCardSkeleton />
      ) : (
        <ChartCard
          title={t('dashboard.games.top_players')}
          description={t('dashboard.games.top_players_desc')}
        >
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">
                    {t('dashboard.games.rank')}
                  </TableHead>
                  <TableHead>{t('dashboard.games.player')}</TableHead>
                  <TableHead className="text-right">
                    {t('dashboard.games.games_played')}
                  </TableHead>
                  <TableHead className="text-right">
                    {t('dashboard.games.total_score')}
                  </TableHead>
                  <TableHead className="text-right">
                    {t('dashboard.games.avg_per_game')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.topPlayers.map((player, index) => (
                  <TableRow key={player.id}>
                    <TableCell className="font-medium">
                      {index === 0 && (
                        <Badge className="bg-yellow-500">🥇</Badge>
                      )}
                      {index === 1 && <Badge className="bg-gray-400">🥈</Badge>}
                      {index === 2 && (
                        <Badge className="bg-orange-600">🥉</Badge>
                      )}
                      {index > 2 && <span>{index + 1}</span>}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={player.avatar} alt={player.name} />
                          <AvatarFallback>
                            {player.name?.slice(0, 2).toUpperCase() || '??'}
                          </AvatarFallback>
                        </Avatar>
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
      )}

      {/* Top Games Analytics */}
      {isLoading ? (
        <div className="space-y-4">
          <ChartCardSkeleton />
        </div>
      ) : (
        // selectedGame === 'overview' &&
        data.gameStats.length > 0 && (
          <ChartCard
            title={t('dashboard.games.top_games')}
            description={t('dashboard.games.top_games_desc')}
          >
            <div className="space-y-4">
              {data.gameStats.map((game, index) => (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                <div
                  key={game.id}
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 group"
                  // onClick={() => setSelectedGame(game.id)}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Principle Image on the left */}
                    {game.principleImage ? (
                      <div className="md:w-48 md:flex-shrink-0 h-40 md:h-auto relative overflow-hidden bg-gray-100">
                        <img
                          src={game.principleImage}
                          alt={game.principleTitle || game.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                      </div>
                    ) : (
                      <div className="md:w-48 md:flex-shrink-0 h-40 md:h-auto bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                        <div className="text-white font-bold text-4xl transform group-hover:scale-110 transition-transform duration-300">
                          {index + 1}
                        </div>
                      </div>
                    )}

                    {/* Information on the right */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg font-bold text-gray-900">
                          {game.name}
                        </h4>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">
                            {t('dashboard.games.plays')}
                          </span>
                          <span className="text-lg font-semibold">
                            {game.plays.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">
                            {t('dashboard.games.avg_score')}
                          </span>
                          <span className="text-lg font-semibold">
                            {game.averageScore.toFixed(0)}
                          </span>
                        </div>
                      </div>

                      {/* Principle Info */}
                      {game.principleNumber && game.principleTitle && (
                        <div className="pt-3 border-t border-gray-100">
                          <div className="flex items-start gap-2">
                            <BookOpen className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">
                                Nguyên tắc TRIZ #{game.principleNumber}:{' '}
                                {game.principleTitle}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        )
      )}
    </DashboardSection>
  );
};
