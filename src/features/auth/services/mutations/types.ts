// Login
export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IGoogleLoginPayload {
  idToken: string;
}

export interface ILoginDataResponse {
  roles: string[];
  tokenType: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}

// Register
export interface IRegisterPayload {
  email: string;
  password: string;
  confirmPassword: string;
}

// Refresh Token
export interface IRefreshTokenPayload {
  refreshToken: string;
}

// Reset Forgot Password
export interface IResetForgotPasswordPayload {
  newPassword: string;
  confirmNewPassword: string;
}
