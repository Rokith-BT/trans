interface PasswordRequestInterface {
  password: string;
  token: string;
  email: string;
}

interface HashRequestInterface {
  hash: string;
}

interface OTPRequestInterface {
  otp: string;
}

export interface ForgotPasswordRequestType {
  email: string;
}

export interface LoginRequestType extends PasswordRequestInterface, ForgotPasswordRequestType {}

export interface ChangePasswordRequestType extends PasswordRequestInterface, HashRequestInterface {}

export interface CreateSessionRequestType extends OTPRequestInterface, HashRequestInterface {}
