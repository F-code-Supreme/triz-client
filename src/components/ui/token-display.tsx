import { Zap } from 'lucide-react';

import { getLocale } from '@/utils';

type TokenDisplayProps = {
  tokens?: number;
  isShortForm?: boolean;
  content?: string;
};

const TokenDisplay = ({
  tokens,
  isShortForm = true,
  content,
}: TokenDisplayProps) => {
  return (
    <div className="flex items-center space-x-2 px-3 py-1.5 rounded-md">
      <Zap className="h-4 w-4 text-secondary" />
      <span className="text-sm font-medium">
        {isShortForm
          ? tokens?.toLocaleString(getLocale(), {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })
          : content}
      </span>
    </div>
  );
};

export default TokenDisplay;
