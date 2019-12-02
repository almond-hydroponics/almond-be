import { Router, Request, Response, NextFunction } from 'express';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';
import redisClient from '../../loaders/redis';
import ScheduleService from '../../services/schedule';
import { IScheduleInputDTO } from '../../interfaces/ISchedule';
import middlewares from '../middlewares';
import * as CronJobManager from 'cron-job-manager';

const manager = new CronJobManager();

const {
  isAuth,
  checkRole,
  attachCurrentUser,
  cacheSchedules,
} = middlewares;

const schedule = Router();

export default (app: Router) => {
  app.use('/', schedule);

   /**
   * @api {GET} api/schedules
   * @description Get all schedules
   * @access Private
   */
  schedule.get('/schedules', isAuth, attachCurrentUser,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger = Container.get('logger');
      // @ts-ignore
      logger.debug('Calling GetAllSchedules endpoint');
      try {
        const user = req.currentUser;
        const scheduleServiceInstance = Container.get(ScheduleService);
        const schedules = await scheduleServiceInstance.GetSchedules(user);

        const HASH_EXPIRATION_TIME = 60 * 60 * 24;

        // set schedules data to redis
        await redisClient.set(
          'schedules',
          JSON.stringify(schedules),
          'EX',
          HASH_EXPIRATION_TIME
          );

        if (schedules.length !== null) {
          return res.status(200).send({
            success: true,
            message: 'Time schedules fetched successfully',
            data: schedules,
          });
        }
        return res.status(202).send({
          success: false,
          message: 'You have not created any time schedules.',
          data: [],
        });
      } catch (e) {
        // @ts-ignore
        logger.error('🔥 error: %o', e);
        return next(e)
      }
  });

  /**
   * @api {POST} api/schedules
   * @description Create a new schedule
   * @access Private
   */
  schedule.post('/schedules', isAuth, attachCurrentUser,
    celebrate({
      body: Joi.object({
        schedule: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response) => {
      const logger = Container.get('logger');
      // @ts-ignore
      logger.debug('Calling CreateSchedule endpoint with body: %o', req.body);
      try {
        const user = req.currentUser;
        const scheduleServiceInstance = Container.get(ScheduleService);
        const { schedule } = await scheduleServiceInstance.CreateSchedule(req.body as IScheduleInputDTO, user);

        const date = new Date(schedule.schedule);
        const minutes = date.getMinutes();
        const hour = date.getHours();

        if (await manager.exists(`${schedule._id}`)) {
          console.log("key exists");
          manager.stop(`${schedule._id}`);
          manager.deleteJob(`${schedule._id}`);
        }

        manager.add(`${schedule._id}`, `${minutes} ${hour} * * *`, () => {
          // @ts-ignore
          logger.debug(`Pump time for ${schedule._id} running at ${hour}:${minutes}`)
        });
        manager.start(`${schedule._id}`);

        return res.status(201).send({
          success: true,
          message: 'Time schedule added successfully',
          data: schedule,
        })
      } catch (e) {
        // @ts-ignore
        logger.error('🔥 error: %o', e);
        const serverError = 'Server Error. Could not complete the request';
        return res.json({serverError}).status(500);
      }
    }
  );

  /**
   * @api {GET} api/schedules/:id
   * @description Get a schedule by id
   * @access Private
   */
  schedule.get('/schedules/:id', isAuth, attachCurrentUser,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger = Container.get('logger');
      // @ts-ignore
      logger.debug('Calling GetAllScheduleById endpoint');
      try {
        const user = req.currentUser;
        const { params: { id } } = req;
        const scheduleServiceInstance = Container.get(ScheduleService);
        const schedule = await scheduleServiceInstance.GetScheduleById(id, user);
        if (schedule) {
          return res.status(200).send({
          success: true,
          message: 'Time schedule has been fetched successfully',
          data: schedule,
        })
        }
        return res.status(404).send({
          success: false,
          message: 'Time schedule does not exist',
        })
      } catch (e) {
        // @ts-ignore
        logger.error('🔥 error: %o', e);
        const serverError = 'Server Error. Could not complete the request';
        return res.json({serverError}).status(500);
      }
  });

  /**
   * @api {PATCH} api/schedules/:id
   * @description Edit a schedule
   * @access Private
   */
  schedule.patch('/schedules/:id', isAuth, attachCurrentUser,
    celebrate({
      body: Joi.object({
        schedule: Joi.string(),
        enabled: Joi.boolean(),
      }),
    }),
    async (req: Request, res: Response) => {
      const logger = Container.get('logger');
      // @ts-ignore
      logger.debug('Calling PatchSchedule endpoint with body: %o', req.body);
      try {
        const user = req.currentUser;
        const { params: { id } } = req;
        const scheduleServiceInstance = Container.get(ScheduleService);
        const { schedule } = await scheduleServiceInstance.EditSchedule(id, req.body as IScheduleInputDTO, user);
        if (schedule) {
          return res.status(200).send({
            success: true,
            message: 'Time schedule updated successfully',
            data: schedule,
          });
        }
          return res.status(404).send({
          success: false,
          message: 'Time schedule does not exist',
        });
      } catch (e) {
        // @ts-ignore
        logger.error('🔥 error: %o', e);
        return res.send({
          success: false,
          message: 'Server Error. Could not complete the request',
        }).status(500)
      }
    }
    );

  /**
   * @api {DELETE} api/schedules/:id
   * @description Delete a schedule by id
   * @access Private
   */
  schedule.delete('/schedules/:id', isAuth, attachCurrentUser,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger = Container.get('logger');
      // @ts-ignore
      logger.debug('Calling DeleteScheduleById endpoint');
      try {
        const user = req.currentUser;
        const { params: { id } } = req;
        const scheduleServiceInstance = Container.get(ScheduleService);
        const schedule = await scheduleServiceInstance.DeleteScheduleById(id, user);
        if (schedule.n > 0) {
          const message = 'Time schedule deleted successfully';
          return res.status(200).json({ message });
        }
        const error = 'Time schedule does not exist';
        return res.status(404).json({ error });
      } catch (e) {
        // @ts-ignore
        logger.error('🔥 error: %o', e);
        const serverError = 'Server Error. Could not complete the request';
        return res.json({serverError}).status(500);
      }
  });
}
