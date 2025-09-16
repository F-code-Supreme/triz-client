export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export enum TokenType {
  ACCESS = 'accessToken',
  REFRESH = 'refreshToken',
}

export interface User {
  id: string;
  email: string;
  roles: Role;
}
