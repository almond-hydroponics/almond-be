import { IUser } from './IUser';

export interface IDevice {
  id: string;
  user?: IUser;
  verified: boolean;
}

export interface IDeviceInputDTO {
  verified?: boolean;
  id: string;
}
