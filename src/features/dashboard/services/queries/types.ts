import type { AssignmentSubmissionStatus } from '@/features/assignment/types';
import type { ForumPostStatus } from '@/features/forum/types';
import type { ReviewStatus } from '@/features/journal-review/types';

export interface PaymentStats {
  totalRevenue: number;
  totalTopupTransactions: number;
  successRate: number;
  failureRate: number;
}
export interface RevenueTrendItem {
  date: string; // định dạng 'YYYY-MM-DD'
  amountVND: number; // số tiền theo VND
}
export interface PaymentStatusItem {
  status: 'COMPLETED' | 'CANCELLED' | 'PENDING'; // có thể mở rộng nếu có thêm trạng thái khác
  count: number; // số lượng tương ứng với trạng thái
}
export interface TopUserItem {
  userId: string; // ID người dùng
  email: string; // Email người dùng
  fullName: string; // Họ tên đầy đủ
  avatarUrl: string; // URL avatar
  totalAmount: number; // Tổng số tiền
}
export interface PackageAnalyticsItem {
  packagePlanName: string; // Tên gói
  totalTokensConsumed: number; // Tổng số token đã sử dụng
  activeSubscribers: number; // Số lượng người đăng ký đang hoạt động
  autoRenewCount: number; // Số lượng tự động gia hạn
}

export interface IGetForumAnalyticsResponse {
  totalPosts: number;
  totalReplies: number;
  totalReposts: number;
  pendingReports: number;
  postStatusDistribution: {
    [status in ForumPostStatus]?: number;
  };
}

export interface AssignmentSubmissionTrendItem {
  date: string; // định dạng 'YYYY-MM-DD'
  count: number; // số lượng nộp bài trong ngày
}

export interface IGetExpertAnalyticsResponse {
  totalSubmissions: number;
  pendingGradingCount: number;
  gradedCount: number;
  passedPercentage: number;
  submissionStatusDistribution: {
    [status in AssignmentSubmissionStatus]?: number;
  };
  totalProblemReviews: number;
  pendingReviewsCount: number;
  completedReviewsCount: number;
  reviewStatusDistribution: {
    [status in ReviewStatus]?: number;
  };
  recentSubmissionTrend: AssignmentSubmissionTrendItem[];
}
