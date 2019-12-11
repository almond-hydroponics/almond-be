import {IActivityLogDto} from "../../interfaces/IActivityLog";
import {IActionTypes, IClientInfoDto} from "../../interfaces/IClientInfo";
const geoIp = require('geoip-lite');
const Sniffer = require('sniffr');

//global
let ip = '', os = '', browser = '', location = '';

const getClientInformation =  function(request) {
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

module.exports = {
  createScheduleActivityLogItem : function (request) {
    initializeClientInfo(request);
    return <IActivityLogDto>{
      action: 'Creating Schedule',
      actionDesc: 'Time schedule added successfully',
      actionType: IActionTypes.CREATE,
      stationIp: ip,
      stationOs: JSON.stringify({ip,os,browser,location})
    }
  },

  deleteScheduleActivityLogItem : function (request) {
    initializeClientInfo(request);
    return <IActivityLogDto>{
      action: 'Deleting Schedule',
      actionDesc: 'Time schedule deleted successfully',
      actionType: IActionTypes.REMOVE,
      stationIp: ip,
      stationOs: JSON.stringify({ip,os,browser,location})
    }
  },

  deviceSwitchedOn : function (request) {
    initializeClientInfo(request);
    return <IActivityLogDto>{
      action: 'Device Status ON',
      actionDesc: 'Device Turned on successfully',
      actionType: IActionTypes._ON,
      stationIp: ip,
      stationOs: JSON.stringify({ip,os,browser,location})
    }
  },

  deviceSwitchedOff : function (request) {
    initializeClientInfo(request);
    return <IActivityLogDto>{
      action: 'Device Status OFF',
      actionDesc: 'Device Turned off successfully',
      actionType: IActionTypes._OFF,
      stationIp: ip,
      stationOs: JSON.stringify({ip,os,browser,location})
    }
  }
};

