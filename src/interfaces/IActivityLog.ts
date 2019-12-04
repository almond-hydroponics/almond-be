// all fields  {{deny Null}}
export interface IActivityLog {
  _id: string;
  actionType: string;
  actionDesc: string;
  action: string;
  userId: string;
  stationIp: string;
  stationOs: string;
}

export interface IActivityLogDto { // Data transfer
  actionType: string;
  actionDesc: string;
  action: string;
  userId: string;
  stationIp: string;
  stationOs: string;
}
