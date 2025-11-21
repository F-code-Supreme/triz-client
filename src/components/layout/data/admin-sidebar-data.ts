import {
  LayoutDashboard,
  Users,
  BookOpen,
  Package,
  GraduationCap,
  BookCheck,
  Receipt,
  Layers2,
  CalendarSync,
  Archive,
} from 'lucide-react';

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
          title: 'Flashcards',
          url: '/admin/flashcards',
          icon: Layers2,
          // children: [
          //   { title: 'Deck', url: '/admin/flashcards/deck', icon: BookOpen },
          //   { title: 'Card', url: '/admin/flashcards/card', icon: BookOpen },
          // ],
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
      ],
    },
    {
      title: 'Payment',
      items: [
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
          title: 'Transactions',
          url: '/admin/transactions',
          icon: Receipt,
        },
      ],
    },
    {
      title: 'Others',
      items: [
        {
          title: 'Archive',
          url: '/admin/archive',
          icon: Archive,
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
