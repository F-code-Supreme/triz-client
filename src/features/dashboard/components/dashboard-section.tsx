import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { ReactNode } from 'react';

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
}

export const ChartCard = ({ title, description, children }: ChartCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
