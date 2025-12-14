import { ModeratorLayout } from '@/layouts/moderator-layout';

const ModeratorReportsManagementPage = () => {
  return (
    <ModeratorLayout meta={{ title: 'Reports Management' }}>
      <div className="space-y-8 p-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Reports Management
          </h1>
          <p className="text-muted-foreground">
            Review and handle user reports and flagged content.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Reports management content will be displayed here.
          </p>
        </div>
      </div>
    </ModeratorLayout>
  );
};

export default ModeratorReportsManagementPage;
