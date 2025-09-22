export enum OtpPurpose {
  REGISTRATION = 'REGISTRATION',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

// Send OTP
export interface ISendOtpPayload {
  email: string;
  purpose: OtpPurpose;
}

export interface ISendOtpDataResponse {
  email: string;
  purpose: OtpPurpose;
  expiresIn: number;
}

// Verify OTP
export interface IVerifyOtpPayload {
  email: string;
  otp: string;
  purpose: OtpPurpose;
}

export interface IVerifyOtpDataResponse {
  purpose: OtpPurpose;
  email: string;
  accessToken?: string;
}
