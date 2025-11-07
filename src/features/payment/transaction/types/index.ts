export type Transaction = {
  id: string;
  walletId: string | null;
  type: TransactionType;
  amount: number;
  orderCode: string;
  provider: string;
  providerTxRef: string | null;
  status: TransactionStatus;
};

export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';
export type TransactionType = 'TOPUP' | 'SPEND';
