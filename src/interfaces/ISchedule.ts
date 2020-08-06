import { IDevice } from './IDevice';

export interface ISchedule {
  _id: string;
  schedule: string;
  user: string;
  enabled: boolean;
  activityHistory: any
  device: IDevice;
}

export interface IScheduleInputDTO {
  schedule: string;
  enabled: string;
  device: string;
}
