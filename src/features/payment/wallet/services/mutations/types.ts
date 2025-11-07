import type { PaymentProvider } from '@/features/payment';

export interface ITopupWalletPayload {
  amount: number;
  provider: PaymentProvider;
  returnUrl: string;
}

export interface ITopupWalletResponse {
  provider: PaymentProvider;
  paymentUrl: string;
  expiresIn: number;
}
