import { Router, Request, Response, NextFunction } from 'express';
import { config } from '../../config';
import { IDeviceInputDTO } from '../../interfaces/IDevice';
import { IScheduleOverrideInputDTO } from '../../interfaces/IScheduleOverride';
import { AppLogger } from '../../loaders/logger';
import DeviceService from '../../services/device';
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
   * @description Edit pump override
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

  /**
   * @api {POST} api/device
   * @description Add a new device
   * @access Private
   */
  device.post('/devices', isAuth, attachCurrentUser,
    celebrate({
      body: Joi.object({
        id: Joi.string().required(),
      })
    }),
    async (req: Request, res: Response) => {
    logger.debug('Calling PostDevices endpoint');
    try {
      const user = req.currentUser;
      const deviceServiceInstance = Container.get(DeviceService);
      const { device } = await deviceServiceInstance.AddDevice(req.body as IDeviceInputDTO, user);

      return res.status(201).send({
        success: true,
        message: 'Device added successfully',
        data: device,
      })
    } catch (e) {
      logger.error('🔥 error: %o', e.stack);
      const serverError = 'Server Error. Could not complete the request';
      return res.json({serverError}).status(500);
    }
  });

   /**
   * @api {POST} api/my-device
   * @description Add device verification
   * @access Private
   */
  device.post('/my-device', isAuth, attachCurrentUser,
    celebrate({
      body: Joi.object({
        id: Joi.string(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
    logger.debug('Calling My Device endpoint');
    try {
      const user = req.currentUser;
      const { id } = req.body;

      const deviceServiceInstance = Container.get(DeviceService);
      const device = await deviceServiceInstance.GetDeviceById(id);
      if (!device) {
        return res.status(404).send({
          success: false,
          message: 'Device ID does not exist. Kindly check again or contact maintenance team.',
        })
      }
      logger.debug(`device, ${device}`);
      if (device.verified) {
        return res.status(400).send({
          success: false,
          message: 'Device has already been verified! Click on the skip button.'
        })
      }
      await deviceServiceInstance.UpdateDevice(req.body as IDeviceInputDTO, user);
      const deviceRecord = await deviceServiceInstance.UserAddDevice(req.body as IDeviceInputDTO, user);
      logger.debug(`deviceRecord, ${JSON.stringify(deviceRecord)}`);
      return res.status(200).send({
        success: true,
        message: 'Device has been added and configured successfully',
        data: deviceRecord,
      })
    } catch (e) {
      logger.error('🔥 error: %o', e.stack);
      return next(e)
    }
  });
}
