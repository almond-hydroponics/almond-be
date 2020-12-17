import { IUser } from './IUser';

export interface IDevice {
	_id?: string;
	id: string;
	user?: IUser | string;
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
