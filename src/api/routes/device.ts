import { Router, Request, Response, NextFunction } from 'express';
import { config } from '../../config';
import { IScheduleOverrideInputDTO } from '../../interfaces/IScheduleOverride';
import { AppLogger } from '../../loaders/logger';
import ScheduleOverrideService from '../../services/scheduleOverride';
import middlewares from '../middlewares';
import {Container} from "typedi";
import {celebrate, Joi} from "celebrate";
import MqttService from "../../services/mqttService";

const {
  isAuth,
  attachCurrentUser,
} = middlewares;
const logger = new AppLogger('Device');

const device = Router();

export default (app: Router) => {
  app.use('/', device);

  /**
   * @api {PATCH} api/pump
   * @description Edit pump status
   * @access Private
   */
  device.patch('/pump', isAuth, attachCurrentUser,
    celebrate({
      body: Joi.object({
        enabled: Joi.boolean(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
    logger.debug('Calling Pump endpoint');
    try {
      const user = req.currentUser;
      const { enabled } = req.body;
      const topic = config.mqtt.scheduleTopic;

      const status = (enabled) ? '1' : '0';

      // instantiate module services
      const scheduleOverrideInstance = Container.get(ScheduleOverrideService);
      const mqttClient = Container.get(MqttService);

      // connect and send message via mqtt
      mqttClient.connect();
      mqttClient.sendMessage(topic, status);

      // save instance of the override
      const scheduleOverride = await scheduleOverrideInstance.EditScheduleOverride(req.body as IScheduleOverrideInputDTO, user);
      return res.status(200).send({
        success: true,
        message: `Manual Override ${enabled ? 'ON' : 'OFF'} successfully`,
        data: scheduleOverride,
      })
    } catch (e) {
      logger.error('🔥 error: %o', e.stack);
      return next(e)
    }
  });

  /**
   * @api {GET} api/pump/:id
   * @description Get a pump by id
   * @access Private
   */
  device.get('/pump', isAuth, attachCurrentUser,
    async (req: Request, res: Response) => {
      logger.debug('Calling GetPumpById endpoint');
      try {
        const user = req.currentUser;
        const scheduleOverrideServiceInstance = Container.get(ScheduleOverrideService);
        const scheduleOverride = await scheduleOverrideServiceInstance.GetScheduleOverride(user);
        if (scheduleOverride) {
          return res.status(200).send({
          success: true,
          message: 'Time schedule has been fetched successfully',
          data: scheduleOverride,
        })
        }
        return res.status(404).send({
          success: false,
          message: 'ScheduleOverride does not exist',
        })
      } catch (e) {
        logger.error('🔥 error: %o', e);
        const serverError = 'Server Error. Could not complete the request';
        return res.json({serverError}).status(500);
      }
  });
}
