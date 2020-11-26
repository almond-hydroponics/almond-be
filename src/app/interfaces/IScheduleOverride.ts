export interface IScheduleOverride {
	id: string;
	user: string;
	enabled: boolean;
	activityHistory: [];
}

export interface IScheduleOverrideInputDTO {
	enabled: boolean;
	deviceId: string;
	activityHistory: [];
}
