export interface ISchedule {
  _id: string;
  schedule: string;
  user: string;
  enabled: boolean;
}

export interface IScheduleInputDTO {
  schedule: string;
  enabled: string;
}
