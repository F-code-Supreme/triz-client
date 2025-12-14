import { LayoutDashboard, GraduationCap, Wrench } from 'lucide-react';
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

export interface ExpertSidebarData {
  navGroups: NavGroup[];
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

export const useExpertSidebarData = (): ExpertSidebarData => {
  const { t } = useTranslation('sidebar');

  return useMemo(
    () => ({
      navGroups: [
        {
          title: t('expert.main'),
          items: [
            {
              title: t('expert.dashboard'),
              url: '/expert',
              icon: LayoutDashboard,
              isActive: true,
            },
          ],
        },
        {
          title: t('expert.assignments'),
          items: [
            {
              title: t('expert.assignments'),
              url: '/expert/assignment',
              icon: GraduationCap,
            },
          ],
        },
        {
          title: t('expert.configuration'),
          items: [
            {
              title: t('expert.six_step_config'),
              url: '/expert/six-step-config',
              icon: Wrench,
            },
          ],
        },
      ],
      user: {
        name: 'Expert',
        email: 'expert@triz.com',
        avatar: '/avatars/expert.jpg',
      },
    }),
    [t],
  );
};
