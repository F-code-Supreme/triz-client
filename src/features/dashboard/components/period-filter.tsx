import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';

type PeriodFilter = 'day' | 'month' | 'quarter';

interface PeriodFilterProps {
  value: PeriodFilter;
  onChange: (period: PeriodFilter) => void;
}

export const PeriodFilter = ({ value, onChange }: PeriodFilterProps) => {
  const { t } = useTranslation('pages.admin');

  const periods: { value: PeriodFilter; label: string }[] = [
    { label: t('dashboard.period_filter.day'), value: 'day' },
    { label: t('dashboard.period_filter.month'), value: 'month' },
    { label: t('dashboard.period_filter.quarter'), value: 'quarter' },
  ];

  return (
    <div className="flex gap-2">
      {periods.map((period) => (
        <Button
          key={period.value}
          variant={value === period.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(period.value)}
        >
          {period.label}
        </Button>
      ))}
    </div>
  );
};
