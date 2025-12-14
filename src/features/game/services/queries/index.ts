import { useQuery } from '@tanstack/react-query';

import { useAxios } from '@/configs/axios';
import { GameKeys } from '@/features/game/services/queries/keys';

import type { GameLeaderboard } from '@/features/game/services/queries/types';

export const useGetGameLeaderboardByIdQuery = (gameId: string) => {
  const _request = useAxios();
  return useQuery({
    queryKey: [GameKeys.GetGameLeaderboardById, gameId],
    queryFn: async () => {
      const response = await _request.get<GameLeaderboard[]>(
        `game-scores/leaderboard/${gameId}/total`,
      );
      return response.data;
    },
  });
};
