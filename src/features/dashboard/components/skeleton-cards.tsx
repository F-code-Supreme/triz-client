import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const StatCardSkeleton = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-[100px]" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-[120px] mb-2" />
        <Skeleton className="h-3 w-[150px]" />
      </CardContent>
    </Card>
  );
};

export const ChartCardSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-[200px] mb-2" />
        <Skeleton className="h-4 w-[250px]" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  );
};

export const TableCardSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-[200px] mb-2" />
        <Skeleton className="h-4 w-[250px]" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex gap-4">
            <Skeleton className="h-10 w-[50px]" />
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-[120px]" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-8 w-[50px]" />
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 w-[120px]" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
