import Sniffer from 'sniffr';
import geoIp from 'geoip-lite';
import { IActivityLogDto } from '../../interfaces/IActivityLog';
import { IActionTypes, IClientInfoDto } from '../../interfaces/IClientInfo';

// global
let ip = '';
let os = '';
let browser = '';
let location = '';

const getClientInformation = function (request) {
	const userAgent = request.headers['user-agent'];
	const sniffer = new Sniffer();
	sniffer.sniff(userAgent);
	const clientOs = sniffer.os;
	browser = sniffer.browser;
	ip = request.clientIp;
	const clientLocation = geoIp.lookup(ip);
	return <IClientInfoDto>{
		ipAddress: ip,
		ipLocation: clientLocation,
		operatingSystem: clientOs,
		browser,
	};
};
const initializeClientInfo = (request) => {
	const clientInfo = getClientInformation(request);
	ip = clientInfo.ipAddress;
	os = clientInfo.operatingSystem;
	browser = clientInfo.browser;
	location = clientInfo.ipLocation;
};

const createScheduleActivityLogItem = (request) => {
	initializeClientInfo(request);
	return <IActivityLogDto>{
		action: 'Creating Schedule',
		actionDesc: 'Time schedule added successfully',
		actionType: IActionTypes.CREATE,
		stationIp: ip,
		stationOs: JSON.stringify({ ip, os, browser, location }),
	};
};

const deleteScheduleActivityLogItem = (request) => {
	initializeClientInfo(request);
	return <IActivityLogDto>{
		action: 'Deleting Schedule',
		actionDesc: 'Time schedule deleted successfully',
		actionType: IActionTypes.REMOVE,
		stationIp: ip,
		stationOs: JSON.stringify({ ip, os, browser, location }),
	};
};

const manualOverrideActivityLog = (request, status) => {
	initializeClientInfo(request);
	return <IActivityLogDto>{
		action: 'Device Manual Override Status',
		actionDesc: `Manual Override ${status ? 'ON' : 'OFF'} successfully`,
		actionType: `${status ? IActionTypes._ON : IActionTypes._OFF}`,
		stationIp: ip,
		stationOs: JSON.stringify({ ip, os, browser, location }),
	};
};

const addDeviceActivityLog = (request, desc) => {
	initializeClientInfo(request);
	return <IActivityLogDto>{
		action: 'Add Device',
		actionDesc: desc,
		actionType: `${IActionTypes.aDEVICE}`,
		stationIp: ip,
		stationOs: JSON.stringify({ ip, os, browser, location }),
	};
};

const deviceConfigurationActivityLog = (request, desc) => {
	initializeClientInfo(request);
	return <IActivityLogDto>{
		action: 'Device Configuration',
		actionDesc: desc,
		actionType: `${IActionTypes.aDEVICE_CONFIG}`,
		stationIp: ip,
		stationOs: JSON.stringify({ ip, os, browser, location }),
	};
};

const deviceConnectionStatus = (request, msg) => {
	initializeClientInfo(request);
	return <IActivityLogDto>{
		action: 'Device Connection Status',
		actionDesc: msg,
		actionType: IActionTypes.CONN,
		stationIp: ip,
		stationOs: JSON.stringify({ ip, os, browser, location }),
	};
};

const internetConnectionStatus = () =>
	<IActivityLogDto>{
		action: 'No Internet',
		actionDesc: 'Internet Connectivity is Unavailable',
		actionType: IActionTypes.OFFLINE,
		stationIp: '',
		stationOs: JSON.stringify({}),
	};

export {
	createScheduleActivityLogItem,
	deleteScheduleActivityLogItem,
	manualOverrideActivityLog,
	addDeviceActivityLog,
	deviceConfigurationActivityLog,
	deviceConnectionStatus,
	internetConnectionStatus,
};
