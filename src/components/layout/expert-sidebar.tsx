import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useLayout } from '@/context/layout-provider';
import useAuth from '@/features/auth/hooks/use-auth';

import { expertSidebarData } from './data/expert-sidebar-data';
import { ExpertAppTitle } from './expert-app-title';
import { NavGroup } from './nav-group';
import { NavUser } from './nav-user';

export const ExpertSidebar = () => {
  const { collapsible, variant } = useLayout();
  const { user } = useAuth();

  const userData = user
    ? {
        name: user.fullName || user.email || 'User',
        email: user.email || 'user@example.com',
        avatar: (user.email || 'U').charAt(0).toUpperCase(),
      }
    : expertSidebarData.user;

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <ExpertAppTitle />
      </SidebarHeader>
      <SidebarContent>
        {expertSidebarData.navGroups.map((props) => (
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
