import { AdminLayout } from '@/layouts/admin-layout';
import {
  RevenueSection,
  UserSection,
  FeedbackReportSection,
  GameSection,
  ChatForumSection,
  mockDashboardData,
} from '@/features/dashboard';

const AdminDashboardPage = () => {
  // Using mock data - replace with API call in production
  const dashboardData = mockDashboardData;

  return (
    <AdminLayout meta={{ title: 'Admin Dashboard' }}>
      <div className="space-y-8 p-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the admin panel. Monitor all key metrics and analytics
            across your platform.
          </p>
        </div>

        {/* Revenue & Course Packages Section */}
        <RevenueSection data={dashboardData.revenue} />

        {/* User Analytics Section */}
        <UserSection data={dashboardData.users} />

        {/* Feedback & Reports Section */}
        <FeedbackReportSection
          feedback={dashboardData.feedback}
          reports={dashboardData.reports}
        />

        {/* Game Analytics Section */}
        <GameSection data={dashboardData.games} />

        {/* Chat & Forum Analytics Section */}
        <ChatForumSection
          chat={dashboardData.chat}
          forum={dashboardData.forum}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
