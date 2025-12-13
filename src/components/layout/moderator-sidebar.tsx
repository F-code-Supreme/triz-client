import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useLayout } from '@/context/layout-provider';
import useAuth from '@/features/auth/hooks/use-auth';

import { useModeratorSidebarData } from './data/moderator-sidebar-data';
import { ModeratorAppTitle } from './moderator-app-title';
import { NavGroup } from './nav-group';
import { NavUser } from './nav-user';

export const ModeratorSidebar = () => {
  const { collapsible, variant } = useLayout();
  const { user } = useAuth();
  const moderatorSidebarData = useModeratorSidebarData();

  const userData = user
    ? {
        name: user.fullName || user.email || 'User',
        email: user.email || 'user@example.com',
        avatar: (user.email || 'U').charAt(0).toUpperCase(),
      }
    : moderatorSidebarData.user;

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <ModeratorAppTitle />
      </SidebarHeader>
      <SidebarContent>
        {moderatorSidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
