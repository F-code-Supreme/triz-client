import { Button } from '@/components/ui/button';

type PeriodFilter = 'day' | 'month' | 'quarter';

interface PeriodFilterProps {
  value: PeriodFilter;
  onChange: (period: PeriodFilter) => void;
}

export const PeriodFilter = ({ value, onChange }: PeriodFilterProps) => {
  const periods: { value: PeriodFilter; label: string }[] = [
    { label: 'Ngày', value: 'day' },
    { label: 'Tháng', value: 'month' },
    { label: 'Quý', value: 'quarter' },
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
