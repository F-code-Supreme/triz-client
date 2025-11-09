import { useGetAllTransactionsQuery } from '@/features/payment/transaction/services/queries';
import { TransactionsTable } from '@/features/payment/wallet/components';
import { AdminLayout } from '@/layouts/admin-layout';

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

const AdminTransactionsPage = () => {
  const { data: transactionsData, isLoading: transactionsLoading } =
    useGetAllTransactionsQuery();

  const transactions = transactionsData?.content || [];

  return (
    <AdminLayout meta={{ title: 'Transactions' }}>
      <div className="flex flex-col gap-8 p-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground mt-2">
            View and manage all system transactions
          </p>
        </div>

        <div>
          <TransactionsTable
            transactions={transactions}
            isLoading={transactionsLoading}
            filters={transactionFilters}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTransactionsPage;
