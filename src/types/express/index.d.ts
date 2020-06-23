import { Document, Model } from 'mongoose';
import { IPermissions } from '../../interfaces/IPermissions';
import { IRole } from '../../interfaces/IRole';
import { IUser } from '../../interfaces/IUser';

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
  }
}

declare module 'redis' {
  export interface RedisClient extends NodeJS.EventEmitter {
    setAsync(key: string, value: string): Promise<void>;

    getAsync(key: string): Promise<string>;
  }
}
