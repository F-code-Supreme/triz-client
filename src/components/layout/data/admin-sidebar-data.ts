import i18next from 'i18next';
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
      title: i18next.t('admin.main', { ns: 'sidebar' }),
      items: [
        {
          title: i18next.t('admin.dashboard', { ns: 'sidebar' }),
          url: '/admin',
          icon: LayoutDashboard,
          isActive: true,
        },
      ],
    },
    {
      title: i18next.t('admin.management', { ns: 'sidebar' }),
      items: [
        {
          title: i18next.t('admin.users', { ns: 'sidebar' }),
          url: '/admin/users',
          icon: Users,
        },
        {
          title: i18next.t('admin.books', { ns: 'sidebar' }),
          url: '/admin/books',
          icon: BookOpen,
        },
        {
          title: i18next.t('admin.flashcards', { ns: 'sidebar' }),
          url: '/admin/flashcards',
          icon: Layers2,
          // children: [
          //   { title: 'Deck', url: '/admin/flashcards/deck', icon: BookOpen },
          //   { title: 'Card', url: '/admin/flashcards/card', icon: BookOpen },
          // ],
        },
        {
          title: i18next.t('admin.courses', { ns: 'sidebar' }),
          url: '/admin/courses',
          icon: GraduationCap,
        },
        {
          title: i18next.t('admin.quizzes', { ns: 'sidebar' }),
          url: '/admin/quizzes',
          icon: BookCheck,
        },
        {
          title: i18next.t('admin.assignments', { ns: 'sidebar' }),
          url: '/admin/assignment',
          icon: BookCheck,
        },
      ],
    },
    {
      title: i18next.t('admin.payment', { ns: 'sidebar' }),
      items: [
        {
          title: i18next.t('admin.packages', { ns: 'sidebar' }),
          url: '/admin/packages',
          icon: Package,
        },
        {
          title: i18next.t('admin.subscriptions', { ns: 'sidebar' }),
          url: '/admin/subscriptions',
          icon: CalendarSync,
        },
        {
          title: i18next.t('admin.transactions', { ns: 'sidebar' }),
          url: '/admin/transactions',
          icon: Receipt,
        },
      ],
    },
    {
      title: i18next.t('admin.others', { ns: 'sidebar' }),
      items: [
        {
          title: i18next.t('admin.archive', { ns: 'sidebar' }),
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
