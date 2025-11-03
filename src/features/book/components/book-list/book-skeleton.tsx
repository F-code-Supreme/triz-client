import { Skeleton } from '@/components/ui/skeleton';

const BookSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="w-full h-48 rounded-lg" />
    <Skeleton className="w-full h-4" />
    <Skeleton className="w-3/4 h-4" />
    <Skeleton className="w-1/2 h-4" />
  </div>
);
export default BookSkeleton;
