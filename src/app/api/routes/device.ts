import { celebrate, Joi } from 'celebrate';
import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { config } from '../../../config';
import { IDeviceInputDTO } from '../../interfaces/IDevice';
import { IScheduleOverrideInputDTO } from '../../interfaces/IScheduleOverride';
import { AppLogger } from '../../app.logger';
import ActivityLogService from '../../services/activityLog';
import DeviceService from '../../services/device';
import MqttService from '../../services/mqttService';
import ScheduleOverrideService from '../../services/scheduleOverride';
import middlewares from '../middlewares';
import { ScheduleOverride } from '../../../config/enums';
import {
	addDeviceActivityLog,
	manualOverrideActivityLog,
} from '../middlewares/logActivity';
import { IActivityLog } from '../../interfaces/IActivityLog';

const {
	isAuth,
	attachCurrentUser,
	checkRole,
	getCache,
	setCache,
	clearCache,
	clearAllCache,
} = middlewares;

const logger = new AppLogger('Device');

const device = Router();

const path = 'DEVICES';

export default (app: Router): void => {
	app.use('/', device);

	/**
	 * @api {PATCH} api/pump
	 * @description Edit pump override
	 * @access Private
	 */
	device.patch(
		'/pump',
		isAuth,
		attachCurrentUser,
		celebrate({
			body: Joi.object({
				enabled: Joi.boolean(),
				device: Joi.string(),
			}),
		}),
		async (req: Request, res: Response, next: NextFunction) => {
			logger.debug('[pumpPatch] Calling Pump endpoint');
			try {
				const user = req.currentUser;
				const { enabled } = req.body;
				const topic = config.mqtt.scheduleTopic;
				const status = enabled ? ScheduleOverride.ON : ScheduleOverride.OFF;
				// instantiate module services
				const scheduleOverrideInstance = Container.get(ScheduleOverrideService);
				const mqttClient = Container.get(MqttService);
				const activityLogInstance = Container.get(ActivityLogService);

				// connect and send message via mqtt
				mqttClient.connect(activityLogInstance, req);
				await mqttClient.sendMessage(topic, status, activityLogInstance, req);

				// save instance of the override
				const {
					scheduleOverride,
				} = await scheduleOverrideInstance.EditScheduleOverride(
					req.body as IScheduleOverrideInputDTO,
					user,
				);
				if (scheduleOverride) {
					try {
						const activityLogInstance = Container.get(ActivityLogService);
						const logActivityItems = manualOverrideActivityLog(
							req,
							!!req.body.enabled,
						);
						await activityLogInstance.CreateActivityLog(logActivityItems, user);
					} catch (e) {
						logger.error('🔥 error on Overriding device : %o', e);
					}
				}
				// get instance override history of a particular user and attach to payload
				let response: IActivityLog[] = [];
				await activityLogInstance
					.GetActivityLogs(user)
					.then((res) => (response = res));

				return res.status(200).send({
					success: true,
					message: `Manual Override ${enabled ? 'ON' : 'OFF'} successfully`,
					data: { scheduleOverride, activityHistory: response },
				});
			} catch (e) {
				logger.error('🔥 error: %o', e.stack);
				return next(e);
			}
		},
	);

	/**
	 * @api {GET} api/pump/:id
	 * @description Get a pump by id
	 * @access Private
	 */
	device.get(
		'/pump',
		isAuth,
		attachCurrentUser,
		async (req: Request, res: Response) => {
			logger.debug('[pumpGet] Calling GetPumpById endpoint');
			try {
				const user = req.currentUser;
				const deviceId = req.query.device as string;

				const pumpServiceInstance = Container.get(ScheduleOverrideService);
				const pumpStatus = await pumpServiceInstance.GetScheduleOverride(
					user,
					deviceId,
				);
				if (!pumpStatus) {
					return res.status(404).send({
						success: false,
						message: 'Pump status does not exist',
					});
				}
				return res.status(200).send({
					success: true,
					message: 'Pump status has been fetched successfully',
					data: pumpStatus,
				});
			} catch (e) {
				logger.error('🔥 error: %o', e);
				const serverError = 'Server Error. Could not complete the request';
				return res.json({ serverError }).status(500);
			}
		},
	);

	/**
	 * @api {POST} api/device
	 * @description Add a new device
	 * @access Private
	 */
	device.post(
		'/devices',
		isAuth,
		attachCurrentUser,
		checkRole('Admin'),
		clearCache(path),
		celebrate({
			body: Joi.object({
				id: Joi.string().required(),
			}),
		}),
		async (req: Request, res: Response, next: NextFunction) => {
			logger.debug('[devices] Calling PostDevices endpoint');
			try {
				const user = req.currentUser;
				const deviceServiceInstance = Container.get(DeviceService);
				const { device } = await deviceServiceInstance.AddDevice(
					req.body as IDeviceInputDTO,
				);

				if (device) {
					const desc = 'Device added successfully';
					try {
						const activityLogInstance = Container.get(ActivityLogService);
						const logActivityItems = addDeviceActivityLog(req, desc);
						await activityLogInstance.CreateActivityLog(logActivityItems, user);
					} catch (e) {
						logger.error('🔥 error Creating Activity Log : %o', e);
					}
					return res.status(201).send({
						success: true,
						message: desc,
						data: device,
					});
				}
			} catch (e) {
				logger.error('🔥 error: %o', e.message);
				if (e.code === 11000) {
					e['status'] = 409;
				}
				return next(e);
			}
		},
	);

	/**
	 * @api {POST} api/my-device
	 * @description Add device verification
	 * @access Private
	 */
	device.post(
		'/my-device',
		isAuth,
		attachCurrentUser,
		clearCache('ME'),
		celebrate({
			body: Joi.object({
				id: Joi.string(),
			}),
		}),
		async (req: Request, res: Response, next: NextFunction) => {
			logger.debug('[myDevice] Calling My Device endpoint');
			try {
				const user = req.currentUser;
				const { id } = req.body;
				const deviceServiceInstance = Container.get(DeviceService);
				const device = await deviceServiceInstance.GetDeviceById(id);

				if (!device) {
					return res.status(404).send({
						success: false,
						message:
							'Device ID does not exist. Kindly check again or contact maintenance team.',
					});
				}

				if (device.verified && device.user !== user._id) {
					return res.status(400).send({
						success: false,
						message:
							'Device has already been taken! Confirm your device ID or contact the maintenance team for support.',
					});
				}

				if (device.verified && device.user === user._id) {
					return res.status(400).send({
						success: false,
						message:
							'Device has already been verified! Click on the skip button.',
					});
				}
				await deviceServiceInstance.UpdateDevice(
					req.body as IDeviceInputDTO,
					user,
				);
				const deviceRecord = await deviceServiceInstance.UserAddDevice(
					device._id,
					user,
				);
				return res.status(200).send({
					success: true,
					message: 'Device has been added and configured successfully',
					data: deviceRecord,
				});
			} catch (e) {
				logger.error('🔥 error: %o', e.stack);
				return next(e);
			}
		},
	);

	/**
	 * @api {PATCH} api/active-device
	 * @description Update active device
	 * @access Private
	 */
	device.patch(
		'/active-device',
		isAuth,
		attachCurrentUser,
		clearAllCache,
		celebrate({
			body: Joi.object({
				id: Joi.string(),
			}),
		}),
		async (req: Request, res: Response, next: NextFunction) => {
			logger.debug('[activeDevice] Calling update current device endpoint');
			try {
				const user = req.currentUser;
				const { id } = req.body;

				const activeDeviceInstance = Container.get(DeviceService);
				const {
					selectedDevice,
				} = await activeDeviceInstance.UpdateCurrentDevice(id, user);

				return res.status(200).send({
					success: true,
					message: `Device with ID ${
						typeof selectedDevice !== 'string' && selectedDevice?.id
					} has been activated`,
					data: selectedDevice,
				});
			} catch (e) {
				logger.error('🔥 error: %o', e.stack);
				return next(e);
			}
		},
	);

	/**
	 * @api {GET} api/device
	 * @description Get all devices
	 * @access Private
	 */
	device.get(
		'/devices',
		isAuth,
		attachCurrentUser,
		checkRole('Admin'),
		getCache(path),
		async (req: Request, res: Response, next: NextFunction) => {
			logger.debug('[devicesGet] Calling GetAllDevices endpoint');
			try {
				const deviceServiceInstance = Container.get(DeviceService);
				const devices = await deviceServiceInstance.GetAllDevices();

				// set schedules data to redis
				setCache(`${req.currentUser._id}/${path}`, devices);

				if (devices.length !== null) {
					return res.status(200).send({
						success: true,
						message: 'Devices fetched successfully',
						data: devices,
					});
				}

				return res.status(202).send({
					success: false,
					message: 'There are no devices present. Create one?',
					data: [],
				});
			} catch (e) {
				logger.error('🔥 error: %o', e.stack);
				const serverError = 'Server Error. Could not complete the request';
				return res.json({ serverError }).status(500);
			}
		},
	);

	/**
	 * @api {DELETE} api/device/:id
	 * @description Delete a device by id
	 * @access Private
	 */
	device.delete(
		'/devices/:id',
		isAuth,
		attachCurrentUser,
		checkRole('Admin'),
		clearCache(path),
		async (req: Request, res: Response, next: NextFunction) => {
			logger.debug('[devicesDelete] Calling DeleteDeviceById endpoint');
			try {
				const {
					params: { id },
				} = req;
				const deviceServiceInstance = Container.get(DeviceService);
				const device = await deviceServiceInstance.DeleteDeviceById(id);
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				if (device.n > 0) {
					const message = 'Device has been deleted successfully';
					return res.status(200).json({ message });
				}
				const error = 'Device does not exist';
				return res.status(404).json({ error });
			} catch (e) {
				logger.error('🔥 error: %o', e.stack);
				const serverError = 'Server Error. Could not complete the request';
				return res.json({ serverError }).status(500);
			}
		},
	);

	/**
	 * @api {PATCH} api/device/:id
	 * @description Edit a device
	 * @access Private
	 */
	device.patch(
		'/devices/:id',
		isAuth,
		attachCurrentUser,
		checkRole('Admin'),
		clearCache(path),
		celebrate({
			body: Joi.object({
				id: Joi.string().required(),
			}),
		}),
		async (req: Request, res: Response) => {
			logger.debug(
				`[devicesPatch] Calling PatchDevice endpoint with body: ${JSON.stringify(
					req.body,
				)}`,
			);
			try {
				const {
					params: { id },
				} = req;
				const scheduleServiceInstance = Container.get(DeviceService);
				const { device } = await scheduleServiceInstance.EditDevice(
					id,
					req.body as IDeviceInputDTO,
				);
				if (device) {
					return res.status(200).send({
						success: true,
						message: 'Device has been updated successfully',
						data: device,
					});
				}
				return res.status(404).send({
					success: false,
					message: 'Device does not exist',
				});
			} catch (e) {
				logger.error('🔥 error: %o', e.stack);
				return res
					.send({
						success: false,
						message: 'Server Error. Could not complete the request',
					})
					.status(500);
			}
		},
	);
};
