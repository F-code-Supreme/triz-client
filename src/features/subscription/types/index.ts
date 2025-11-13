export interface Subscription {
  id: string;
  startDate: string;
  endDate: string;
  status: SubscriptionStatus;
  autoRenew: boolean;
  tokensPerDayRemaining: number;
  lastTokenRefreshDate: string;
  lastRenewalAttemptDate: string;
  userId: string;
  userFullName: string;
  packageId: string;
  packageName: string;
  walletTransId: string;
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED',
  CANCELED = 'CANCELED',
}
