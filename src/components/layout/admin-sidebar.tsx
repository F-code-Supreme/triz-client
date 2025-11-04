import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useLayout } from '@/context/layout-provider';
import useAuth from '@/features/auth/hooks/use-auth';

import { AdminAppTitle } from './admin-app-title';
import { adminSidebarData } from './data/admin-sidebar-data';
import { NavGroup } from './nav-group';
import { NavUser } from './nav-user';

export const AdminSidebar = () => {
  const { collapsible, variant } = useLayout();
  const { user } = useAuth();

  const userData = user
    ? {
        name: user.name || user.email || 'User',
        email: user.email || 'user@example.com',
        avatar: (user.email || 'U').charAt(0).toUpperCase(),
      }
    : adminSidebarData.user;

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <AdminAppTitle />
      </SidebarHeader>
      <SidebarContent>
        {adminSidebarData.navGroups.map((props) => (
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
