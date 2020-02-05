export interface IScheduleOverride {
  id: string;
  user: string;
  enabled: boolean;
  activityHistory: any;
}

export interface IScheduleOverrideInputDTO {
  enabled: boolean;
  activityHistory: any;
}
