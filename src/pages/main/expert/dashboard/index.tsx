import { ExpertLayout } from '@/layouts/expert-layout';

const ExpertDashboardPage = () => {
  return (
    <ExpertLayout meta={{ title: 'Expert Dashboard' }}>
      <div className="space-y-8 p-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the expert panel. Manage your courses, content, and
            interact with students.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card p-6">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Total Courses
              </span>
              <span className="text-3xl font-bold">0</span>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Total Students
              </span>
              <span className="text-3xl font-bold">0</span>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Active Quizzes
              </span>
              <span className="text-3xl font-bold">0</span>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Forum Posts
              </span>
              <span className="text-3xl font-bold">0</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-muted-foreground">
            No recent activity to display.
          </p>
        </div>
      </div>
    </ExpertLayout>
  );
};

export default ExpertDashboardPage;
