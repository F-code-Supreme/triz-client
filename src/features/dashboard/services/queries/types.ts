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
