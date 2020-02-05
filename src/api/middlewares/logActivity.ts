import {IActivityLogDto} from "../../interfaces/IActivityLog";
import {IActionTypes, IClientInfoDto} from "../../interfaces/IClientInfo";

const geoIp = require('geoip-lite');
const Sniffer = require('sniffr');

//global
let ip = '', os = '', browser = '', location = '';

const getClientInformation = function (request) {
  let userAgent, sniffer, clientOs, clientLocation, clientBrowser, ip;
  userAgent = request.headers["user-agent"];
  sniffer = new Sniffer();
  sniffer.sniff(userAgent);
  clientOs = sniffer.os;
  browser = sniffer.browser;
// @ts-ignore
  ip = request.clientIp;
  clientLocation = geoIp.lookup(ip);
  return <IClientInfoDto>{
    ipAddress: ip,
    ipLocation: clientLocation,
    operatingSystem: clientOs,
    browser: browser
  }
};
const initializeClientInfo = function (request) {
  const clientInfo = getClientInformation(request);
  ip = clientInfo.ipAddress;
  os = clientInfo.operatingSystem;
  browser = clientInfo.browser;
  location = clientInfo.ipLocation;
};

  function createScheduleActivityLogItem (request) {
    initializeClientInfo(request);
    return <IActivityLogDto>{
      action: 'Creating Schedule',
      actionDesc: 'Time schedule added successfully',
      actionType: IActionTypes.CREATE,
      stationIp: ip,
      stationOs: JSON.stringify({ip, os, browser, location})
    }
  }
  function deleteScheduleActivityLogItem (request) {
    initializeClientInfo(request);
    return <IActivityLogDto>{
      action: 'Deleting Schedule',
      actionDesc: 'Time schedule deleted successfully',
      actionType: IActionTypes.REMOVE,
      stationIp: ip,
      stationOs: JSON.stringify({ip, os, browser, location})
    }
  }
  function manualOverrideActivityLog (request, status) {
    initializeClientInfo(request);
    return <IActivityLogDto>{
      action: 'Device Manual Override Status',
      actionDesc: `Manual Override turned ${status ? 'ON' : 'OFF'} successfully`,
      actionType: `${status ? IActionTypes._ON : IActionTypes._OFF }`,
      stationIp: ip,
      stationOs: JSON.stringify({ip, os, browser, location})
    }
  }
  function addDeviceActivityLog (request, desc) {
    initializeClientInfo(request);
    return <IActivityLogDto>{
      action: 'Add Device',
      actionDesc: desc,
      actionType: `${IActionTypes.aDEVICE}`,
      stationIp: ip,
      stationOs: JSON.stringify({ip, os, browser, location})
    }
  }

  function deviceConfigurationActivityLog (request, desc) {
    initializeClientInfo(request);
    return <IActivityLogDto>{
      action: 'Device Configuration',
      actionDesc: desc,
      actionType: `${IActionTypes.aDEVICE_CONFIG}`,
      stationIp: ip,
      stationOs: JSON.stringify({ip, os, browser, location})
    }
  }
  function deviceConnectionStatus (request, msg) {
    initializeClientInfo(request);
    return <IActivityLogDto>{
      action: 'Device Connection Status',
      actionDesc: msg,
      actionType: IActionTypes.CONN,
      stationIp: ip,
      stationOs: JSON.stringify({ip, os, browser, location})
    }
  }
  function internetConnectionStatus () {
    return <IActivityLogDto>{
      action: 'No Internet',
      actionDesc: 'Internet Connectivity is Unavailable',
      actionType: IActionTypes.OFFLINE,
      stationIp: '',
      stationOs: JSON.stringify({})
    }
  }

export {
  createScheduleActivityLogItem,
  deleteScheduleActivityLogItem,
  manualOverrideActivityLog,
  addDeviceActivityLog,
  deviceConfigurationActivityLog,
  deviceConnectionStatus,
  internetConnectionStatus
}
;

