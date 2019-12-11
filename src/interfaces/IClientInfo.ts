export interface IClientInfoDto {
  ipAddress: string,
  operatingSystem: string,
  ipLocation: string,
  browser: string,
}

export enum IActionTypes {
  CREATE = "CREATING SCHEDULER",
  REMOVE = "DELETED SCHEDULER",
  _ON = "PUMP ON",
  _OFF = "PUMP OFF",
}
