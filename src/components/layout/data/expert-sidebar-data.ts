import { LayoutDashboard, GraduationCap } from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

export interface NavLink {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  children?: NavLink[];
}

export interface NavGroup {
  title: string;
  items: NavLink[];
}

export interface ExpertSidebarData {
  navGroups: NavGroup[];
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

export const expertSidebarData: ExpertSidebarData = {
  navGroups: [
    {
      title: 'Main',
      items: [
        {
          title: 'Dashboard',
          url: '/expert',
          icon: LayoutDashboard,
          isActive: true,
        },
      ],
    },
    {
      title: 'Assignments',
      items: [
        {
          title: 'Assignments',
          url: '/expert/assignment',
          icon: GraduationCap,
        },
      ],
    },
  ],
  user: {
    name: 'Expert',
    email: 'expert@triz.com',
    avatar: '/avatars/expert.jpg',
  },
};
