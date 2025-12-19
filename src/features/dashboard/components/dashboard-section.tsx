import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

import { PeriodFilter } from './period-filter';

import type { ReactNode } from 'react';

type PeriodFilterType = 'day' | 'month' | 'quarter';

interface DashboardSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}

export const DashboardSection = ({
  title,
  description,
  children,
  action,
}: DashboardSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </div>
  );
};

interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  period?: PeriodFilterType;
  onPeriodChange?: (period: PeriodFilterType) => void;
}

export const ChartCard = ({
  title,
  description,
  children,
  period,
  onPeriodChange,
}: ChartCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {period && onPeriodChange && (
            <div className="flex justify-end">
              <PeriodFilter value={period} onChange={onPeriodChange} />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
