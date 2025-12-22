import { Badge } from '@/components/ui/badge';

import type { ReviewStatus } from '../types';

export const reviewStatusLabels: Record<ReviewStatus, string> = {
  PENDING: 'Chờ xử lý',
  PROCESSING: 'Đang xử lý',
  REVIEWED: 'Đã đánh giá',
  APPROVED: 'Đã kết thúc',
  COMMENTED: 'Đã nhận xét',
};

export const reviewStatusColors: Record<ReviewStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
  PROCESSING: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  REVIEWED: 'bg-green-100 text-green-700 hover:bg-green-100',
  APPROVED: 'bg-purple-100 text-purple-700 hover:bg-purple-100',
  COMMENTED: 'bg-gray-100 text-gray-700 hover:bg-gray-100',
};

export const getReviewStatusBadge = (
  status: ReviewStatus,
  size: 'sm' | 'md' = 'sm',
) => {
  switch (status) {
    case 'PENDING':
      return (
        <Badge
          variant="secondary"
          className={
            size === 'md' ? 'bg-yellow-600 h-9 rounded-md' : 'bg-yellow-600'
          }
        >
          {reviewStatusLabels[status]}
        </Badge>
      );
    case 'PROCESSING':
      return (
        <Badge
          variant="default"
          className={
            size === 'md' ? 'bg-blue-600 h-9 rounded-md' : 'bg-blue-600'
          }
        >
          {reviewStatusLabels[status]}
        </Badge>
      );
    case 'REVIEWED':
      return (
        <Badge
          variant="default"
          className={
            size === 'md' ? 'bg-purple-600 h-9 rounded-md' : 'bg-purple-600'
          }
        >
          {reviewStatusLabels[status]}
        </Badge>
      );
    case 'APPROVED':
      return (
        <Badge
          variant="default"
          className={
            size === 'md' ? 'bg-green-600 h-9 rounded-md' : 'bg-green-600'
          }
        >
          {reviewStatusLabels[status]}
        </Badge>
      );
    case 'COMMENTED':
      return <Badge variant="outline">{reviewStatusLabels[status]}</Badge>;
    default:
      return null;
  }
};
