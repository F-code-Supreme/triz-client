import { RoleIUser } from '../types';

import type { FilterOption } from '@/components/data-table';
import type { TFunction } from 'i18next';

export const getUserFilters = (
  t: TFunction<'pages.admin', undefined>,
): FilterOption[] => [
  {
    columnId: 'roles',
    title: t('users.filters.role'),
    options: [
      {
        label: t('users.form.role_user'),
        value: RoleIUser.USER,
      },
      {
        label: t('users.form.role_admin'),
        value: RoleIUser.ADMIN,
      },
      {
        label: t('users.form.role_expert'),
        value: RoleIUser.EXPERT,
      },
      {
        label: t('users.form.role_moderator'),
        value: RoleIUser.MODERATOR,
      },
    ],
  },
  {
    columnId: 'enabled',
    title: t('users.filters.status'),
    options: [
      {
        label: t('users.form.status_active'),
        value: 'true',
      },
      {
        label: t('users.form.status_inactive'),
        value: 'false',
      },
    ],
  },
];
