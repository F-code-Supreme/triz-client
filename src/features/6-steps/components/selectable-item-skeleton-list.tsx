import { Skeleton } from '@/components/ui/skeleton';

export const SelectableItemSkeleton = () => {
  return (
    <div className="w-full pl-3.5 pr-3 py-4 rounded-lg bg-primary-foreground outline outline-1 outline-offset-[-1px] outline-slate-100 dark:outline-slate-800 flex justify-between items-center gap-5">
      <Skeleton className="h-5 w-full" />
    </div>
  );
};

export const SelectableItemSkeletonList = ({
  count = 3,
}: {
  count?: number;
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <SelectableItemSkeleton key={index} />
      ))}
    </>
  );
};
