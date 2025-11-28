import {
  Pie,
  PieChart as RechartsPieChart,
  Cell,
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

interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  title?: string;
  description?: string;
  height?: number;
  colors?: string[];
  showLabel?: boolean;
  innerRadius?: number;
  outerRadius?: number;
}

export function PieChart({
  data,
  title,
  description,
  height = 350,
  colors = [
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#ff7c7c',
    '#8dd1e1',
    '#d084d8',
    '#ffa07a',
  ],
  showLabel = true,
  innerRadius = 0,
  outerRadius = 100,
}: PieChartProps) {
  const renderLabel = (entry: any) => {
    return `${entry.name}: ${entry.value}`;
  };

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
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              fill="#8884d8"
              dataKey="value"
              label={showLabel ? renderLabel : false}
              labelLine={showLabel}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
            />
            <Legend />
          </RechartsPieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Donut Chart variant
export function DonutChart(props: Omit<PieChartProps, 'innerRadius'>) {
  return <PieChart {...props} innerRadius={60} />;
}
