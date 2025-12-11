export interface GameLeaderboard {
  id: string;
  userId?: string;
  userName: string;
  userAvatarUrl?: string | null;
  gameId?: string;
  gameName?: string;
  score: number;
  milestone?: number;
  timeTaken?: number;
  attempts?: number;
  completed?: boolean;
  isPassed?: boolean;
  createdAt?: string; // hoặc Date nếu bạn parse
}
