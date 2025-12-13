import { LayoutDashboard, MessageSquare, Flag } from 'lucide-react';
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

export interface ModeratorSidebarData {
  navGroups: NavGroup[];
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

export const useModeratorSidebarData = (): ModeratorSidebarData => {
  const { t } = useTranslation('sidebar');

  return useMemo(
    () => ({
      navGroups: [
        {
          title: t('moderator.main'),
          items: [
            {
              title: t('moderator.dashboard'),
              url: '/moderator',
              icon: LayoutDashboard,
              isActive: true,
            },
          ],
        },
        {
          title: t('moderator.content'),
          items: [
            {
              title: t('moderator.forum'),
              url: '/moderator/forum',
              icon: MessageSquare,
            },
            {
              title: t('moderator.reports'),
              url: '/moderator/reports',
              icon: Flag,
            },
          ],
        },
      ],
      user: {
        name: 'Moderator',
        email: 'moderator@triz.com',
        avatar: '/avatars/moderator.jpg',
      },
    }),
    [t],
  );
};
