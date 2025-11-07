import { useState } from 'react';

import useAuth from '@/features/auth/hooks/use-auth';
import { useGetAllTransactionsByUserQuery } from '@/features/payment/transaction/services/queries';
import {
  WalletBalanceCard,
  TopupDialog,
  TransactionsTable,
} from '@/features/payment/wallet/components';
import { useGetWalletByUserQuery } from '@/features/payment/wallet/services/queries';
import { DefaultLayout } from '@/layouts/default-layout';

// Transaction type filter options
const transactionFilters = [
  {
    columnId: 'type',
    title: 'Transaction Type',
    options: [
      { label: 'Top up', value: 'TOPUP' },
      { label: 'Spend', value: 'SPEND' },
    ],
  },
  {
    columnId: 'status',
    title: 'Status',
    options: [
      { label: 'Pending', value: 'PENDING' },
      { label: 'Completed', value: 'COMPLETED' },
      { label: 'Cancelled', value: 'CANCELLED' },
    ],
  },
];

const WalletPage = () => {
  const [topupOpen, setTopupOpen] = useState(false);
  const { user } = useAuth();

  const { data: wallet, isLoading: walletLoading } = useGetWalletByUserQuery(
    user?.id,
  );

  const { data: transactionsData, isLoading: transactionsLoading } =
    useGetAllTransactionsByUserQuery(user?.id);

  const transactions = transactionsData?.content || [];

  return (
    <DefaultLayout meta={{ title: 'Wallet' }}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
          <p className="text-muted-foreground mt-2">
            Manage your wallet balance and view transaction history
          </p>
        </div>

        <WalletBalanceCard
          wallet={wallet}
          isLoading={walletLoading}
          onTopupClick={() => setTopupOpen(true)}
        />

        <div>
          <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
          <TransactionsTable
            transactions={transactions}
            isLoading={transactionsLoading}
            filters={transactionFilters}
          />
        </div>

        <TopupDialog open={topupOpen} onOpenChange={setTopupOpen} />
      </div>
    </DefaultLayout>
  );
};

export default WalletPage;
