import type { JwtPayload } from 'jwt-decode';

export enum Role {
  USER = 'ROLE_user',
  ADMIN = 'ROLE_admin',
  EXPERT = 'ROLE_expert',
}

export enum TokenType {
  ACCESS = 'accessToken',
  REFRESH = 'refreshToken',
}

export interface User {
  id: string;
  email: string;
  roles: Role[];
  fullName?: string;
  avatarUrl?: string;
  enabled?: boolean;
}

export interface AppJwtPayload extends JwtPayload {
  userId: string;
  authorities: Role;
}
