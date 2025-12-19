import { Badge } from '@/components/ui/badge';

import type { ReviewStatus } from '../types';

export const reviewStatusLabels: Record<ReviewStatus, string> = {
  PENDING: 'Chờ xử lý',
  PROCESSING: 'Đang xử lý',
  REVIEWED: 'Đã đánh giá',
  APPROVED: 'Đã phê duyệt',
  COMMENTED: 'Đã nhận xét',
};

export const reviewStatusColors: Record<ReviewStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
  PROCESSING: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  REVIEWED: 'bg-green-100 text-green-700 hover:bg-green-100',
  APPROVED: 'bg-purple-100 text-purple-700 hover:bg-purple-100',
  COMMENTED: 'bg-gray-100 text-gray-700 hover:bg-gray-100',
};

export const getReviewStatusBadge = (status: ReviewStatus) => {
  switch (status) {
    case 'PENDING':
      return <Badge variant="secondary">Chờ xử lý</Badge>;
    case 'PROCESSING':
      return (
        <Badge variant="default" className="bg-blue-600">
          Đang xử lý
        </Badge>
      );
    case 'REVIEWED':
      return (
        <Badge variant="default" className="bg-purple-600">
          Đã đánh giá
        </Badge>
      );
    case 'APPROVED':
      return (
        <Badge variant="default" className="bg-green-600">
          Đã phê duyệt
        </Badge>
      );
    case 'COMMENTED':
      return <Badge variant="outline">Đã nhận xét</Badge>;
    default:
      return null;
  }
};
