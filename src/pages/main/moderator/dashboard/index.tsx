import { ModeratorLayout } from '@/layouts/moderator-layout';

const ModeratorDashboardPage = () => {
  return (
    <ModeratorLayout meta={{ title: 'Moderator Dashboard' }}>
      <div className="space-y-8 p-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the moderator panel. Manage forum content and review
            reports.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Pending Reports
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
          <div className="rounded-lg border bg-card p-6">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Total Actions
              </span>
              <span className="text-3xl font-bold">0</span>
            </div>
          </div>
        </div>
      </div>
    </ModeratorLayout>
  );
};

export default ModeratorDashboardPage;
