import { Router, Request, Response, NextFunction } from 'express';
import { config } from '../../config';
import { IDeviceInputDTO } from '../../interfaces/IDevice';
import { IScheduleOverrideInputDTO } from '../../interfaces/IScheduleOverride';
import { AppLogger } from '../../loaders/logger';
import ActivityLogService from '../../services/activityLog';
import DeviceService from '../../services/device';
import MqttService from '../../services/mqttService';
import ScheduleOverrideService from '../../services/scheduleOverride';
import middlewares from '../middlewares';
import {Container} from "typedi";
import {celebrate, Joi} from "celebrate";
import {IScheduleInputDTO} from "../../interfaces/ISchedule";

const {
  isAuth,
  attachCurrentUser,
} = middlewares;
const logger = new AppLogger('Device');
const logActivity = require('../middlewares/logActivity');
const device = Router();

export default (app: Router) => {
  app.use('/', device);


  // @ts-ignore
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
<<<<<<< HEAD
      logger.debug('Calling Pump endpoint');
      try {
        // @ts-ignore
        const user = req.currentUser;
        // @ts-ignore
        const {enabled} = req.body;
        const topic = config.mqtt.scheduleTopic;
        const status = (enabled) ? '1' : '0';
   /*     // instantiate module services
        const scheduleOverrideInstance = Container.get(ScheduleOverrideService);
        const mqttClient = Container.get(MqttService);
        const activityLogInstance = Container.get(ActivityLogService);
*/
=======
    logger.debug('Calling Pump endpoint');
    try {
      const user = req.currentUser;
      const { enabled } = req.body;
      const topic = config.mqtt.scheduleTopic;

      const status = (enabled) ? '1' : '0';

>>>>>>> (fix)pump manual override payload
      // instantiate module services
      const scheduleOverrideInstance = Container.get(ScheduleOverrideService);
      const mqttClient = Container.get(MqttService);
      const activityLogInstance = Container.get(ActivityLogService);

        // connect and send message via mqtt
        mqttClient.connect(activityLogInstance, req);
        mqttClient.sendMessage(topic, status, activityLogInstance, req);
      // save instance of the override
      const scheduleOverride = await scheduleOverrideInstance.EditScheduleOverride(req.body as IScheduleOverrideInputDTO, user);
      if(scheduleOverride){
        try {
          const activityLogInstance = Container.get(ActivityLogService);
          const logActivityItems = logActivity.manualOverrideActivityLog(req, !!req.body.enabled);
          await activityLogInstance.createActivityLog(logActivityItems, user);
        } catch (e) {
          // @ts-ignore
          logger.error('🔥 error on Overriding device : %o', e);
        }
      }
      // get instance override history of a particular user and attach to payload
      let response: any = '';
      await activityLogInstance.GetActivityLogs(user).then(
        res => {
          response = res;
        }
      );

      let dto: IScheduleInputDTO = {
        schedule: '',
        enabled: req.body.enabled,
        user: user,
<<<<<<< HEAD
        deviceId:'',
=======
>>>>>>> (fix)pump manual override payload
        activityHistory: response
      };
      return res.status(200).send({
        success: true,
        message: `Manual Override ${enabled ? 'ON' : 'OFF'} successfully`,
        data: dto,
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

        if (device) {
          let desc = 'Device added successfully';
          try {
            const activityLogInstance = Container.get(ActivityLogService);
            const logActivityItems = logActivity.addDeviceActivityLog(req, desc);
            await activityLogInstance.createActivityLog(logActivityItems, user);
          } catch (e) {
            // @ts-ignore
            logger.error('🔥 error Creating Activity Log : %o', e);
          }
          return res.status(201).send({
            success: true,
            message: desc,
            data: device,
          })
        }
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
