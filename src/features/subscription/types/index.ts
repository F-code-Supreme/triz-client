export interface Subscription {
  id: string;
  startDate: string;
  endDate: string;
  status: SubscriptionStatus;
  autoRenew: boolean;
  tokensPerDayRemaining: number;
  lastTokenRefreshDate: string;
  lastRenewalAttemptDate: string | null;
  userId: string;
  userFullName: string;
  packageId: string;
  packageName: string;
  packageChatTokenPerDay: number;
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED',
  CANCELED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}
