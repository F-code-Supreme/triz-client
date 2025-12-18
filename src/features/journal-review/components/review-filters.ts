import type { ReviewStatus } from '../types';
import type { FilterOption } from '@/components/data-table';

export const getReviewFilters = (): FilterOption[] => [
  {
    columnId: 'status',
    title: 'Trạng thái',
    options: [
      {
        label: 'Chờ xử lý',
        value: 'PENDING',
      },
      {
        label: 'Đang xử lý',
        value: 'PROCESSING',
      },
      {
        label: 'Đã đánh giá',
        value: 'REVIEWED',
      },
      {
        label: 'Đã phê duyệt',
        value: 'APPROVED',
      },
      {
        label: 'Đã nhận xét',
        value: 'COMMENTED',
      },
    ] as { label: string; value: ReviewStatus }[],
  },
];
