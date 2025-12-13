import type { GamesEnumId } from '@/features/game/services/mutations/enum';

export interface CreateScorePayload {
  gameId: GamesEnumId;
  score: number;
  timeTaken?: number;
  milestone?: number;
}
