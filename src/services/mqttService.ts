import * as mqtt from 'mqtt';
import {Service} from "typedi";
import { config } from '../config';
import { AppLogger } from '../loaders/logger';


@Service()
export default class MqttService {
  private logger = new AppLogger(MqttService.name);
  constructor(
    private mqttClient = mqtt.connect(config.mqtt.server),
  ) {}

  public connect() {
    // connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)

    // Mqtt error callback
    this.mqttClient.on('error', (err) => {
      this.logger.error(err.message, err.stack);
      this.mqttClient.end();
    });

    // Connection callback
    this.mqttClient.on('connect', () => {
      this.logger.debug(`mqtt client connected`);
    });

    // mqtt subscriptions
    this.mqttClient.subscribe('almond/test', {qos: 0});

    // When a message arrives, console.log it
    this.mqttClient.on('message', (topic, message) => {
      this.logger.debug(message.toString());
    });

    this.mqttClient.on('close', () => {
      this.logger.debug(`mqtt client disconnected`);
    });
  }

  // Sends a mqtt message to topic: almond
  public sendMessage(topic, message) {
    try {
      this.mqttClient.publish(topic, message);
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  }
}
