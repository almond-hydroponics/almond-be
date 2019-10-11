import { Router, Request, Response, NextFunction } from 'express';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';
import ScheduleService from '../../services/schedule';
import { IScheduleInputDTO } from '../../interfaces/ISchedule';

const route = Router();

export default (app: Router) => {
  app.use('/', route);

  // Get all schedules
  route.get(
    '/schedule',
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
          message: 'You have not created any time schedules.'
        });
      } catch (e) {
        // @ts-ignore
        logger.error('🔥 error: %o', e);
        return next(e)
      }
  });

  // Create a schedule
  route.post('/schedule',
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
        return res.status(500).json({serverError})
      }
    }
  );

  // Get schedule by it's id
  route.get('/schedule/:id',
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
        return res.status(500).json({serverError});
      }
  });

  // Update a schedule
  route.patch('/schedule/:id',
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
        const serverError = 'Server Error. Could not complete the request';
        return res.status(500).json({serverError})
      }
    }
    );

  // Delete a schedule
  route.delete(
    '/schedule/:id',
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
        return res.status(500).json({serverError});
      }
  });
}
