import {
  Line,
  LineChart as RechartsLineChart,
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

interface LineChartProps {
  data: Array<Record<string, any>>;
  xKey: string;
  lines: Array<{
    dataKey: string;
    stroke?: string;
    name?: string;
  }>;
  title?: string;
  description?: string;
  height?: number;
}

export const LineChart = ({
  data,
  xKey,
  lines,
  title,
  description,
  height = 350,
}: LineChartProps) => {
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
          <RechartsLineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey={xKey}
              className="text-sm"
              tick={{ fill: 'hsl(var(--foreground))' }}
            />
            <YAxis
              className="text-sm"
              tick={{ fill: 'hsl(var(--foreground))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Legend />
            {lines.map((line, index) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.stroke || colors[index % colors.length]}
                name={line.name || line.dataKey}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
