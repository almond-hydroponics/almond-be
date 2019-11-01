
import * as mqtt from 'mqtt';
import config from '../config';
import {Inject, Service} from "typedi";
import {IMqttInputDTO} from "../interfaces/IMqtt";


@Service()
export default class MqttService {
  // private mqttClient: null;
  constructor(
    @Inject('logger') private logger,
    private mqttClient = mqtt.connect(config.mqtt.server),
  ) {}

  public connect() {
    // connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)

    // Mqtt error callback
    // @ts-ignore
    this.mqttClient.on('error', (err) => {
      this.logger.error(err);
      this.mqttClient.end();
    });

    // Connection callback
    // @ts-ignore
    this.mqttClient.on('connect', () => {
      this.logger.debug(`mqtt client connected`);
    });

    // mqtt subscriptions
    // @ts-ignore
    this.mqttClient.subscribe('almond/test', {qos: 0});

    // When a message arrives, console.log it
    // @ts-ignore
    this.mqttClient.on('message', function (topic, message) {
      console.log(message.toString());
    });

    // @ts-ignore
    this.mqttClient.on('close', () => {
      // @ts-ignore
      this.logger.debug(`mqtt client disconnected`);
    });
  }

  // Sends a mqtt message to topic: almond
  public sendMessage(topic, message) {
    try {
      // @ts-ignore
      this.mqttClient.publish(topic, message);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
