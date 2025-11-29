import type { SubscriptionStatus } from '../../types';

export interface IPurchaseSubscriptionPayload {
  packageId: string;
  autoRenew: boolean;
}

export interface IPurchaseSubscriptionResponse {
  id: string;
  packagePlanName: string;
  price: number;
  startDate: string;
  endDate: string;
  status: SubscriptionStatus;
  tokensPerDayRemaining: number;
  autoRenew: boolean;
  remainingBalance: number;
  walletTransId: string;
}

export interface IEditAutoRenewalPayload {
  userId: string;
  subscriptionId: string;
  autoRenew: boolean;
}

export interface ICancelSubscriptionPayload {
  userId: string;
  subscriptionId: string;
}

export interface IRefundSubscriptionPayload {
  userId: string;
  transactionId: string;
}
