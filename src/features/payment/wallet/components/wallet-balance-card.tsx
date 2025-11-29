import { CreditCard, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { formatTrizilium } from '@/utils';

import type { Wallet } from '../types';

interface WalletBalanceCardProps {
  wallet: Wallet | undefined;
  isLoading: boolean;
  onTopupClick: () => void;
}

export const WalletBalanceCard: React.FC<WalletBalanceCardProps> = ({
  wallet,
  isLoading,
  onTopupClick,
}) => {
  const balanceInTrizilium = wallet?.balance || 0;

  return (
    <div className="w-full rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Wallet Balance</h2>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="h-12 bg-muted animate-pulse rounded" />
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">
              {formatTrizilium(balanceInTrizilium, { showSymbol: false })}
            </span>
            <span className="text-sm text-muted-foreground">Trizilium</span>
          </div>
        )}

        <Button
          onClick={onTopupClick}
          className="w-full gap-2"
          size="lg"
          disabled={isLoading}
        >
          <Plus className="h-4 w-4" />
          Top up Wallet
        </Button>
      </div>
    </div>
  );
};
