export interface FormFields {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?:string;
  lastName?:string;
}

export interface SuccessfulAuthResponse  {
    token : string,
    message: string
}
