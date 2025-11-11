import type { RoleUser } from '@/features/auth/types';

export interface ICreateUserPayload {
  email: string;
  password: string;
  roles: RoleUser;
  fullName?: string;
  avatarUrl?: string;
  enabled?: boolean;
}

export interface IEditUserPayload {
  id: string;
  password?: string;
  roles?: RoleUser;
  fullName?: string;
  avatarUrl?: string;
  enabled?: boolean;
}
