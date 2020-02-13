import { IUser } from './IUser';

export interface IDevice {
  id: string;
  user?: IUser;
  verified?: boolean;
  enabled?: boolean;
}

export interface IDeviceInputDTO {
  verified?: boolean;
  enabled?: boolean;
  id: string;
}

export interface IDeviceActiveInputDTO {
  id: string;
}
