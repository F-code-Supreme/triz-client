import type { AssignmentSubmissionStatus } from '../types';

export const getAssignmentSubmissionStatusColors = (
  status: AssignmentSubmissionStatus,
): string => {
  switch (status) {
    case 'EXPERT_PENDING':
      return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
    case 'AI_PENDING':
      return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
    case 'APPROVED':
      return 'bg-green-100 text-green-700 hover:bg-green-100';
    case 'AI_REJECTED':
    case 'REJECTED':
      return 'bg-red-100 text-red-700 hover:bg-red-100';
    default:
      return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
  }
};

export const assignmentSubmissionStatusLabels: Record<
  AssignmentSubmissionStatus,
  string
> = {
  PENDING: 'Chờ nộp bài',
  EXPERT_PENDING: 'Chờ chuyên gia đánh giá',
  AI_PENDING: 'Chờ AI đánh giá',
  APPROVED: 'Đã duyệt',
  AI_REJECTED: 'Bị từ chối bởi AI',
  REJECTED: 'Bị từ chối bởi chuyên gia',
};
