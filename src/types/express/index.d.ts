import { Document, Model } from 'mongoose';
import { IPermissions } from '../../app/interfaces/IPermissions';
import { IRole } from '../../app/interfaces/IRole';
import { IUser } from '../../app/interfaces/IUser';
import { ISchedule } from '../../app/interfaces/ISchedule';
import { IDevice } from '../../app/interfaces/IDevice';
import { IScheduleOverride } from '../../app/interfaces/IScheduleOverride';
import { IActivityLog } from '../../app/interfaces/IActivityLog';

declare global {
	namespace Express {
		export interface Request {
			currentUser: IUser & Document;
		}
	}

	namespace Models {
		export type UserModel = Model<IUser & Document>;
		export type RoleModel = Model<IRole & Document>;
		export type PermissionsModel = Model<IPermissions & Document>;
		export type ScheduleModel = Model<ISchedule & Document>;
		export type DeviceModel = Model<IDevice & Document>;
		export type ScheduleOverride = Model<IScheduleOverride & Document>;
		export type ActivityLogModel = Model<IActivityLog & Document>;
	}
}

declare module 'redis' {
	export interface RedisClient extends NodeJS.EventEmitter {
		setAsync(key: string, value: string): Promise<void>;

		getAsync(key: string): Promise<string>;
	}
}
