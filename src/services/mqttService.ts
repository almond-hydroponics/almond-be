import fs from 'fs';
import path from 'path';
import mqtt from 'mqtt';
import { Service } from 'typedi';
import { config } from '../config';
import { AppLogger } from '../loaders/logger';
import ActivityLogService from './activityLog';
import { Request } from 'express';
import { deviceConnectionStatus } from '../api/middlewares/logActivity';
import { IError } from '../shared/IError';

const KEY = fs.readFileSync(path.join(__dirname, '..', 'certificates', '/tls-key.pem'));
const CERT = fs.readFileSync(path.join(__dirname, '..', 'certificates', '/tls-cert.crt'));
const TRUSTED_CA = fs.readFileSync(path.join(__dirname, '..', 'certificates', '/crt-ca.crt'));

const {
  host,
  password,
  protocol,
  port,
  user,
} = config.mqtt;

const options = {
  port,
  host,
  user,
  protocol,
  password,
  key: KEY,
  cert: CERT,
  ca: TRUSTED_CA,
  rejectUnauthorized: true,
};

@Service()
export default class MqttService {
  private logger = new AppLogger(MqttService.name);

  constructor(
    private mqttClient = mqtt.connect(config.mqtt.server),
  ) {
  }

  public connect(activityLogInstance: ActivityLogService, req: Request) {
    // connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
    // Mqtt error callback
    this.mqttClient.on('error', (err: IError) => {
      this.logger.error(err.message, err.stack);
      this.deviceConnectivityLog(activityLogInstance, req, 'Device Connection Error ');
      this.mqttClient.end();
    });

    // Connection callback
    this.mqttClient.on('connect', success => {
      this.logger.debug('mqtt client connected');
      this.deviceConnectivityLog(activityLogInstance, req, 'Device Connection Successful');
    });

    // mqtt subscriptions
    this.mqttClient.subscribe('almond/test', { qos: 0 });

    // When a message arrives, console.log it
    this.mqttClient.on('message', (topic, message) => {
      this.logger.debug(message.toString());
    });

    this.mqttClient.on('close', close => {
      this.logger.debug('mqtt client disconnected');
      this.deviceConnectivityLog(activityLogInstance, req, 'Device Disconnected');
    });
  }

  public async deviceConnectivityLog(activityLogInstance: ActivityLogService, req: Request, msg: string) {
    try {
      const user = req.currentUser;
      const logActivityItems = deviceConnectionStatus(req, msg);
      await activityLogInstance.CreateActivityLog(logActivityItems, user);
    } catch (e) {
      this.logger.error('🔥 Error Creating Activity Log : %o', e);
    }
  }

  // Sends a mqtt message to topic: almond
  public sendMessage(topic, message, activityLogInstance, req) {
    try {
      this.mqttClient.publish(topic, message);
      this.logger.warn(message);
      this.deviceConnectivityLog(activityLogInstance, req, 'Message Published');
    } catch (e) {
      this.logger.error(e.message, e.stack);
      this.deviceConnectivityLog(activityLogInstance, req, 'Error while publish Message ');
      throw e;
    }
  }
}
