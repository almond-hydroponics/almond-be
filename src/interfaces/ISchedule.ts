export interface ISchedule {
  _id: string;
  schedule: string;
  user: string;
  enabled: boolean;
  activityHistory: any
}

export interface IScheduleInputDTO {
  schedule: string;
  enabled: string;
  user: any;
  activityHistory:any;
  deviceId: string;

}
