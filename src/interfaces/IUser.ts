export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  salt?: string;
  photo?: string;
  isVerified?: boolean;
  googleId?: string;
  verificationToken?: string;
}

export interface IUserInputDTO {
  name: string;
  email: string;
  password?: string;
  photo?: string;
  isVerified?: boolean;
}
