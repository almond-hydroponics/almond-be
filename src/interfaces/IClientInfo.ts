export interface IClientInfoDto {
  ipAddress: string,
  operatingSystem: string,
  ipLocation: string,
  browser: string,
}

export enum IActionTypes {
  aDEVICE_CONFIG = 'ADDING DEVICE CONFIGURATIONS',
  CREATE = 'CREATING SCHEDULER',
  REMOVE = 'DELETED SCHEDULER',
  aDEVICE = 'ADDING DEVICE',
  rDEVICE = "REMOVED DEVICE",
  _ON = "PUMP ON",
  _OFF = "PUMP OFF",
  OFFLINE = "NO INTERNET",
  CONN = "DEVICE CONNECTION",
}
