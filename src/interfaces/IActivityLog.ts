// all fields  {{deny Null}}
export interface IActivityLog {
  _id: string;
  actionType: string;
  actionDesc: string;
  action: string;
  userId: string;
  stationIp: string;
  stationOs: string;
  user: string
}

export interface IActivityLogDto { // Data transfer
  actionType: string;
  actionDesc: string;
  action: string;
  userId: string;
  stationIp: string;
  stationOs: string;
}

export interface User {
  role: string;
  photo: string;
  isVerified: boolean;
  _id: string;
  email: string;
  __v: number;
  createdAt: Date;
  name: string;
  updatedAt: Date;
}

export interface ActivityHistory {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  type: string;
  message: string;
}

 export interface Data {
  enabled: boolean;
  _id: string;
  user: User;
  activityHistory: ActivityHistory[];
}

export interface IActivityLogPayload {
  success: boolean;
  message: string;
  data: Data;
}
