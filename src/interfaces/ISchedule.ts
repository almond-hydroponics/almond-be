export interface ISchedule {
  _id: string;
  schedule: string;
  user: string;
}

export interface IScheduleInputDTO {
  schedule: string;
}
