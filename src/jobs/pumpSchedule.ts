import { Container } from 'typedi';
import { config } from '../config';
import { AppLogger } from '../loaders/logger';
import MqttService from '../services/mqttService';

export default class PumpScheduleJob {
  public async handler(job, done): Promise<void> {
    const logger = new AppLogger('Pump Schedule');
    try {
      logger.debug('✌️ Pump schedule triggered!');
      const topic = config.mqtt.scheduleTopic;
      const mqttServiceInstance = Container.get(MqttService);
      await mqttServiceInstance.connect();
      await mqttServiceInstance.sendMessage(topic, '1');
      logger.debug('Pump has been turned on successfully');
      done()
    } catch (e) {
      logger.error('🔥 Error with Pump Schedule:', e.stack);
      done(e)
    }
  }
}
