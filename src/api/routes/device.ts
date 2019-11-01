import * as mqtt from 'mqtt'
import { Router, Request, Response, NextFunction } from 'express';
import middlewares from '../middlewares';
import {Container} from "typedi";
import {celebrate, Joi} from "celebrate";
import config from "../../config";
import MqttService from "../../services/mqttService";

const {
  host, password, user, port, protocol
} = config.mqtt;

const {
  isAuth,
  attachCurrentUser,
} = middlewares;

const device = Router();

export default (app: Router) => {
  app.use('/', device);

  /**
   * @api {POST} api/pump
   * @description Get my personal details
   * @access Private
   */
  device.post('/pump',
    celebrate({
      body: Joi.object({
        status: Joi.string().required(),
      }),
    }),
    (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get('logger');
    // @ts-ignore
    logger.debug('Calling Pump endpoint');
    try {
      const user = req.currentUser;
      const { status } = req.body;
      const topic = config.mqtt.scheduleTopic;
      const mqttClient = Container.get(MqttService);
      mqttClient.connect();
      mqttClient.sendMessage(topic, status);
      return res.status(200).send({
        success: true,
        message: `Manual Override ${(parseInt(status, 10)==1) ? 'ON' : 'OFF'} successfully`,
      })
    } catch (e) {
      // @ts-ignore
      logger.error('🔥 error: %o', e);
      return next(e)
    }
    });
}
