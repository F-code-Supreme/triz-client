import type { GamesEnumId } from '../../configs';

export interface CreateScorePayload {
  gameId: GamesEnumId;
  score: number;
  timeTaken?: number;
  milestone?: number;
}
