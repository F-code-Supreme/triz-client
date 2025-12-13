import { ModeratorLayout } from '@/layouts/moderator-layout';

const ModeratorForumManagementPage = () => {
  return (
    <ModeratorLayout meta={{ title: 'Forum Management' }}>
      <div className="space-y-8 p-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Forum Management
          </h1>
          <p className="text-muted-foreground">
            Moderate forum posts, comments, and user discussions.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Forum management content will be displayed here.
          </p>
        </div>
      </div>
    </ModeratorLayout>
  );
};

export default ModeratorForumManagementPage;
