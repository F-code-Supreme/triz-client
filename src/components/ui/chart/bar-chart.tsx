import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface BarChartProps {
  data: Array<Record<string, any>>;
  xKey: string;
  bars: Array<{
    dataKey: string;
    fill?: string;
    name?: string;
  }>;
  title?: string;
  description?: string;
  height?: number;
  layout?: 'horizontal' | 'vertical';
  stacked?: boolean;
}

export const BarChart = ({
  data,
  xKey,
  bars,
  title,
  description,
  height = 350,
  layout = 'horizontal',
  stacked = false,
}: BarChartProps) => {
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  return (
    <Card>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsBarChart data={data} layout={layout}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            {layout === 'horizontal' ? (
              <>
                <XAxis
                  dataKey={xKey}
                  className="text-sm"
                  tick={{ fill: 'hsl(var(--foreground))' }}
                />
                <YAxis
                  className="text-sm"
                  tick={{ fill: 'hsl(var(--foreground))' }}
                />
              </>
            ) : (
              <>
                <XAxis
                  type="number"
                  className="text-sm"
                  tick={{ fill: 'hsl(var(--foreground))' }}
                />
                <YAxis
                  dataKey={xKey}
                  type="category"
                  className="text-sm"
                  tick={{ fill: 'hsl(var(--foreground))' }}
                />
              </>
            )}
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend />
            {bars.map((bar, index) => (
              <Bar
                key={bar.dataKey}
                dataKey={bar.dataKey}
                fill={bar.fill || colors[index % colors.length]}
                name={bar.name || bar.dataKey}
                stackId={stacked ? 'stack' : undefined}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
