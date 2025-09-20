import type { JwtPayload } from 'jwt-decode';

export enum Role {
  USER = 'ROLE_user',
  ADMIN = 'ROLE_admin',
}

export enum TokenType {
  ACCESS = 'accessToken',
  REFRESH = 'refreshToken',
}

export interface User {
  id: string;
  email: string;
  roles: Role[];
}

export interface AppJwtPayload extends JwtPayload {
  userId: string;
  authorities: Role;
}
