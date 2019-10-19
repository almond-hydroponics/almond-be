import { Router, Request, Response, NextFunction } from 'express';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';
import ScheduleService from '../../services/schedule';
import { IScheduleInputDTO } from '../../interfaces/ISchedule';

const route = Router();

export default (app: Router) => {
  app.use('/', route);

  /**
   * @route GET api/schedules
   * @description Get all schedules
   * @access Private
   */
  route.get(
    '/schedules',
    async (req: Request, res: Response, next: NextFunction) => {
      const logger = Container.get('logger');
      // @ts-ignore
      logger.debug('Calling GetAllSchedules endpoint');
      try {
        const scheduleServiceInstance = Container.get(ScheduleService);
        const schedules = await scheduleServiceInstance.GetSchedules();
        if (schedules.length > 0) {
          return res.status(200).send({
            success: true,
            message: 'Time schedules fetched successfully',
            data: schedules,
          });
        }
        return res.status(404).send({
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
   * @route POST api/schedules
   * @description Create a new schedule
   * @access Private
   */
  route.post('/schedules',
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
        const scheduleServiceInstance = Container.get(ScheduleService);
        const { schedule } = await scheduleServiceInstance.CreateSchedule(req.body as IScheduleInputDTO);
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
   * @route GET api/schedules/:id
   * @description Get a schedule by id
   * @access Private
   */
  route.get('/schedules/:id',
    async (req: Request, res: Response, next: NextFunction) => {
      const logger = Container.get('logger');
      // @ts-ignore
      logger.debug('Calling GetAllScheduleById endpoint');
      try {
        const { params: { id } } = req;
        const scheduleServiceInstance = Container.get(ScheduleService);
        const schedule = await scheduleServiceInstance.GetScheduleById(id);
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
   * @route PATCH api/schedules/:id
   * @description Edit a schedule
   * @access Private
   */
  route.patch('/schedules/:id',
    celebrate({
      body: Joi.object({
        schedule: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response) => {
      const logger = Container.get('logger');
      // @ts-ignore
      logger.debug('Calling PatchSchedule endpoint with body: %o', req.body);
      try {
        const { params: { id } } = req;
        const scheduleServiceInstance = Container.get(ScheduleService);
        const { schedule } = await scheduleServiceInstance.EditSchedule(id, req.body as IScheduleInputDTO);
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
   * @route DELETE api/schedules/:id
   * @description Delete a schedule by id
   * @access Private
   */
  route.delete(
    '/schedules/:id',
    async (req: Request, res: Response, next: NextFunction) => {
      const logger = Container.get('logger');
      // @ts-ignore
      logger.debug('Calling DeleteScheduleById endpoint');
      try {
        const { params: { id } } = req;
        const scheduleServiceInstance = Container.get(ScheduleService);
        const schedule = await scheduleServiceInstance.DeleteScheduleById(id);
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
