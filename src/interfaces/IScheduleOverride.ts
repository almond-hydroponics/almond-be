export interface IScheduleOverride {
  id: string;
  user: string;
  enabled: boolean;
}

export interface IScheduleOverrideInputDTO {
  enabled: boolean;
}
