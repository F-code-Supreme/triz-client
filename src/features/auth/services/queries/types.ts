import type { Role } from '../../types';

export interface IGetMeDataResponse {
  id: string;
  email: string;
  enabled: boolean;
  roles: Role;
  createdAt: string;
  updatedAt: string;
  fullName?: string;
  avatarUrl?: string;
}
