import { Router, Request, Response, NextFunction } from 'express';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';
import { AppLogger } from '../../app.logger';
import ScheduleService from '../../services/schedule';
import { IScheduleInputDTO } from '../../interfaces/ISchedule';
import middlewares from '../middlewares';
import CronJobManager from 'cron-job-manager';
import ActivityLogService from '../../services/activityLog';
import {
	createScheduleActivityLogItem,
	deleteScheduleActivityLogItem,
} from '../middlewares/logActivity';
import HttpResponse from '../../utils/httpResponse';
import HttpError from '../../utils/httpError';
import isArrayNotNull from '../../utils/isArrayNotNull';
import APIError from '../../utils/apiError';
import { HttpStatusCode } from '../../utils/errorHandler';

const manager = new CronJobManager();
const logger = new AppLogger('Schedule');

const { isAuth, attachCurrentUser, getCache, setCache, clearCache } =
	middlewares;
const schedule = Router();

const path = 'SCHEDULES';

export default (app: Router): void => {
	app.use('/', schedule);

	/**
	 * @api {GET} api/schedules
	 * @description Get all schedules
	 * @access Private
	 */
	schedule.get(
		'/schedules',
		isAuth,
		attachCurrentUser,
		// getCache(path),
		async (req: Request, res: Response, next: NextFunction) => {
			let message;
			logger.debug('[schedulesGet] Calling GetAllSchedules endpoint');
			try {
				const user = req.currentUser;
				const { device } = req.query;
				const scheduleServiceInstance = Container.get(ScheduleService);
				const schedules = await scheduleServiceInstance.GetSchedules(
					user,
					device as string,
				);

				// set schedules data to redis
				// setCache(`${req.currentUser._id}/${path}`, schedules);

				if (schedules.length !== null) {
					message = 'Time schedules fetched successfully';
					return HttpResponse.sendResponse(res, 200, true, message, schedules);
				}
				message = 'You have not created any time schedules';
				return HttpResponse.sendResponse(res, 404, false, message, schedules);
			} catch (error) {
				logger.error('🔥 error: %o', error.stack);
				return next(error);
			}
		},
	);

	/**
	 * @api {POST} api/schedules
	 * @description Create a new schedule
	 * @access Private
	 */
	schedule.post(
		'/schedules',
		isAuth,
		attachCurrentUser,
		clearCache(path),
		celebrate({
			body: Joi.object({
				schedule: Joi.string().required(),
				device: Joi.string().required(),
			}),
		}),
		async (req: Request, res: Response, next: NextFunction) => {
			let message;
			logger.debug(
				`[schedulesCreate] Calling CreateSchedule endpoint with body: ${JSON.stringify(
					req.body,
				)}`,
			);
			try {
				const user = req.currentUser;
				const scheduleServiceInstance = Container.get(ScheduleService);
				const { schedule } = await scheduleServiceInstance.CreateSchedule(
					req.body as IScheduleInputDTO,
					user,
				);

				// const date = new Date(schedule.schedule);
				// const minutes = date.getMinutes();
				// const hour = date.getHours();
				//
				// if (await manager.exists(`${schedule._id}`)) {
				// 	manager.stop(`${schedule._id}`);
				// 	manager.deleteJob(`${schedule._id}`);
				// }
				//
				// manager.add(`${schedule._id}`, `${minutes} ${hour} * * *`, () => {
				// 	logger.debug(
				// 		`Pump time for ${schedule._id} running at ${hour}:${minutes}`,
				// 	);
				// });
				// manager.start(`${schedule._id}`);

				// if (schedule) {
				// 	// update activity log
				// 	const activityLogInstance = Container.get(ActivityLogService);
				// 	try {
				// 		const logActivityItems = createScheduleActivityLogItem(req);
				// 		await activityLogInstance.CreateActivityLog(logActivityItems, user);
				// 		activityLogInstance.GetActivityLogs(user).then((res) => {
				// 			schedule.activityHistory = res;
				// 		});
				// 	} catch (e) {
				// 		logger.error('🔥 error Creating Activity Log : %o', e);
				// 	}
				// }
				message = 'Time schedule added successfully';
				return HttpResponse.sendResponse(res, 201, true, message, schedule);
			} catch (e) {
				logger.error('🔥 error: %o', e.message);
				next(e);
			}
		},
	);

	/**
	 * @api {GET} api/schedules/:id
	 * @description Get a schedule by id
	 * @access Private
	 */
	schedule.get(
		'/schedules/:id',
		isAuth,
		attachCurrentUser,
		async (req: Request, res: Response, next: NextFunction) => {
			let message;
			logger.debug('Calling GetAllScheduleById endpoint');
			try {
				const user = req.currentUser;
				const {
					params: { id },
				} = req;
				const scheduleServiceInstance = Container.get(ScheduleService);
				const schedule = await scheduleServiceInstance.GetScheduleById(
					id,
					user,
				);
				if (!schedule) {
					message = 'Time schedule does not exist';
					return HttpResponse.sendResponse(res, 404, true, message, schedule);
				}
				message = 'Time schedule has been fetched successfully';
				return HttpResponse.sendResponse(res, 200, true, message, schedule);
			} catch (e) {
				logger.error('🔥 error: %o', e.stack);
				next(e);
			}
		},
	);

	/**
	 * @api {PATCH} api/schedules/:id
	 * @description Edit a schedule
	 * @access Private
	 */
	schedule.put(
		'/schedules/:id',
		isAuth,
		attachCurrentUser,
		clearCache(path),
		celebrate({
			body: Joi.object({
				schedule: Joi.string(),
				enabled: Joi.boolean(),
				device: Joi.string().required(),
			}),
		}),
		async (req: Request, res: Response, next: NextFunction) => {
			logger.debug(
				`Calling PatchSchedule endpoint with body: ${JSON.stringify(
					req.body,
				)}`,
			);
			try {
				let message;
				const user = req.currentUser;
				const {
					params: { id },
				} = req;
				const scheduleServiceInstance = Container.get(ScheduleService);
				const { schedule } = await scheduleServiceInstance.EditSchedule(
					id,
					req.body as IScheduleInputDTO,
					user,
				);
				if (schedule) {
					message = 'Time schedule updated successfully';
					return HttpResponse.sendResponse(res, 200, true, message, schedule);
				}
				message = 'Time schedule does not exist';
				return HttpResponse.sendResponse(res, 404, false, message, schedule);
			} catch (e) {
				logger.error('🔥 error: %o', e.stack);
				next(e);
			}
		},
	);

	/**
	 * @api {DELETE} api/schedules/:id
	 * @description Delete a schedule by id
	 * @access Private
	 */
	schedule.delete(
		'/schedules/:id',
		isAuth,
		attachCurrentUser,
		clearCache(path),
		async (req: Request, res: Response, next: NextFunction) => {
			logger.debug('Calling DeleteScheduleById endpoint');
			try {
				let message;
				const user = req.currentUser;
				const {
					params: { id },
				} = req;
				const scheduleServiceInstance = Container.get(ScheduleService);
				const schedule = await scheduleServiceInstance.DeleteScheduleById(
					id,
					user,
				);
				if (schedule.n > 0) {
					const activityLogInstance = Container.get(ActivityLogService);
					try {
						const logActivityItems = deleteScheduleActivityLogItem(req);
						await activityLogInstance.CreateActivityLog(
							logActivityItems,
							user,
						);
					} catch (e) {
						logger.error('🔥 error Creating Activity Log : %o', e);
					}
					message = 'Time schedule deleted successfully';
					return HttpResponse.sendResponse(res, 200, true, message, schedule);
				}
				message = 'Time schedule does not exist';
				return HttpResponse.sendResponse(res, 404, false, message, schedule);
			} catch (e) {
				logger.error('🔥 error: %o', e.stack);
				next(e);
			}
		},
	);
};
