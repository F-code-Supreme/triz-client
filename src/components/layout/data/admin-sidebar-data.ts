import {
  LayoutDashboard,
  Users,
  BookOpen,
  Package,
  GraduationCap,
  BookCheck,
  Receipt,
  CalendarSync,
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

export interface NavLink {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
}

export interface NavGroup {
  title: string;
  items: NavLink[];
}

export interface AdminSidebarData {
  navGroups: NavGroup[];
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

export const adminSidebarData: AdminSidebarData = {
  navGroups: [
    {
      title: 'Main',
      items: [
        {
          title: 'Dashboard',
          url: '/admin',
          icon: LayoutDashboard,
          isActive: true,
        },
      ],
    },
    {
      title: 'Management',
      items: [
        {
          title: 'Users',
          url: '/admin/users',
          icon: Users,
        },
        {
          title: 'Books',
          url: '/admin/books',
          icon: BookOpen,
        },
        {
          title: 'Packages',
          url: '/admin/packages',
          icon: Package,
        },
        {
          title: 'Subscriptions',
          url: '/admin/subscriptions',
          icon: CalendarSync,
        },
        {
          title: 'Courses',
          url: '/admin/courses',
          icon: GraduationCap,
        },
        {
          title: 'Quizzes',
          url: '/admin/quizzes',
          icon: BookCheck,
        },
        {
          title: 'Transactions',
          url: '/admin/transactions',
          icon: Receipt,
        },
      ],
    },
  ],
  user: {
    name: 'Admin User',
    email: 'admin@example.com',
    avatar: 'A',
  },
};
