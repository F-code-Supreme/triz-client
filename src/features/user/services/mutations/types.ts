import type { RoleIUser } from '../../types';

export interface ICreateUserPayload {
  email: string;
  password: string;
  roles: RoleIUser;
  fullName?: string;
  avatarUrl?: string;
  enabled?: boolean;
}

export interface IEditUserPayload {
  id: string;
  password?: string;
  roles?: RoleIUser;
  fullName?: string;
  avatarUrl?: string;
  enabled?: boolean;
}
