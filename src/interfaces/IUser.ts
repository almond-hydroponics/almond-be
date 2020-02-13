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
  roles?: [
    {
      title?: string;
      _id?: string;
    }
  ];
  currentRole: string;
  devices?: [
    {
      _id: string;
      id: string;
      verified: string;
    }
  ];
  activeDevice?: string;
}

export interface IUserInputDTO {
  name: string;
  email: string;
  password?: string;
  photo?: string;
  isVerified?: boolean;
  role?: string;
}
