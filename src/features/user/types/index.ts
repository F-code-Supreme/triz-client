import type { User } from '@/features/auth/types';

export enum RoleIUser {
  USER = 'user',
  ADMIN = 'admin',
  EXPERT = 'expert',
}

export type IUser = Omit<User, 'roles'> & {
  roles: RoleIUser;
};
