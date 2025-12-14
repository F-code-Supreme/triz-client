import {
  LayoutDashboard,
  Users,
  BookOpen,
  Package,
  GraduationCap,
  BookCheck,
  Receipt,
  CalendarSync,
  Archive,
  Award,
  MessageSquare,
  Settings,
} from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

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

export const useAdminSidebarData = (): AdminSidebarData => {
  const { t } = useTranslation('sidebar');

  return useMemo(
    () => ({
      navGroups: [
        {
          title: t('admin.main'),
          items: [
            {
              title: t('admin.dashboard'),
              url: '/admin',
              icon: LayoutDashboard,
              isActive: true,
            },
          ],
        },
        {
          title: t('admin.management'),
          items: [
            {
              title: t('admin.users'),
              url: '/admin/users',
              icon: Users,
            },
            {
              title: t('admin.books'),
              url: '/admin/books',
              icon: BookOpen,
            },
            {
              title: t('admin.courses'),
              url: '/admin/courses',
              icon: GraduationCap,
            },
            {
              title: t('admin.quizzes'),
              url: '/admin/quizzes',
              icon: BookCheck,
            },
            {
              title: t('admin.achievements'),
              url: '/admin/achievements',
              icon: Award,
            },
            {
              title: t('admin.forum'),
              url: '/admin/forum',
              icon: MessageSquare,
            },
          ],
        },
        {
          title: t('admin.payment'),
          items: [
            {
              title: t('admin.packages'),
              url: '/admin/packages',
              icon: Package,
            },
            {
              title: t('admin.subscriptions'),
              url: '/admin/subscriptions',
              icon: CalendarSync,
            },
            {
              title: t('admin.transactions'),
              url: '/admin/transactions',
              icon: Receipt,
            },
          ],
        },
        {
          title: t('admin.others'),
          items: [
            {
              title: t('admin.archive'),
              url: '/admin/archive',
              icon: Archive,
            },
            {
              title: t('admin.system_config'),
              url: '/admin/system-config',
              icon: Settings,
            },
          ],
        },
      ],
      user: {
        name: 'Admin User',
        email: 'admin@example.com',
        avatar: 'A',
      },
    }),
    [t],
  );
};
