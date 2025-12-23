// Dashboard Analytics Types

export interface RevenueData {
  period: string;
  revenue: number;
  packages: number;
}

export interface PackageStats {
  id: string;
  name: string;
  purchases: number;
  revenue: number;
  successRate: number;
}

export interface TopSpender {
  id: string;
  name: string;
  email: string;
  totalSpent: number;
  purchases: number;
}

export interface TransactionStats {
  total: number;
  success: number;
  failed: number;
  successRate: number;
  failureRate: number;
}

export interface UserStats {
  total: number;
  new: number;
  active: number;
  growth: number;
}

export interface FeedbackDistribution {
  rating: number;
  count: number;
  percentage: number;
}

export interface FeedbackStats {
  total: number;
  averageRating: number;
  distribution: FeedbackDistribution[];
  sentimentBreakdown: {
    good: number;
    medium: number;
    bad: number;
  };
}

export interface ReportIssue {
  type: string;
  count: number;
  percentage: number;
}

export interface GameStats {
  id: string;
  name: string;
  plays: number;
  averageScore: number;
  completionRate: number;
  averageTimePlay: number; // in minutes
  thumbnailUrl?: string;
  principleNumber?: number;
  principleTitle?: string;
  principleImage?: string;
}

export interface GamePeriodData {
  period: string;
  plays: number;
  averageScore: number;
  completionRate: number;
}

export interface TopPlayer {
  id: string;
  name: string;
  avatar: string;
  score: number;
  gamesPlayed: number;
}

export interface ChatStats {
  totalMessages: number;
  botMessages: number;
  userMessages: number;
  averageResponseTime: number;
  satisfactionRating: number;
  satisfactionBreakdown: {
    satisfied: number;
    neutral: number;
    unsatisfied: number;
  };
}

export interface DashboardData {
  revenue: {
    total: number;
    growth: number;
    byPeriod: RevenueData[];
    byPackage: PackageStats[];
    topSpenders: TopSpender[];
    transactions: TransactionStats;
  };
  users: UserStats;
  feedback: FeedbackStats;
  reports: {
    total: number;
    byType: ReportIssue[];
  };
  games: {
    totalPlays: number;
    byPeriod: GamePeriodData[];
    gameStats: GameStats[];
    topPlayers: TopPlayer[];
    mostPlayed: GameStats;
  };
  chat: ChatStats;
}
