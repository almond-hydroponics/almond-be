import mqtt from 'mqtt';
import { Service } from 'typedi';
import { config } from '../../config';
import { AppLogger } from '../app.logger';
import ActivityLogService from './activityLog';
import { Request } from 'express';
import { deviceConnectionStatus } from '../api/middlewares/logActivity';
import { IError } from '../shared/IError';

@Service()
export default class MqttService {
	private logger = new AppLogger(MqttService.name);

	constructor(private mqttClient = mqtt.connect(config.mqtt.server)) {}

	public connect(): void {
		// connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
		// Mqtt error callback
		this.mqttClient.on('error', async (err: IError) => {
			this.logger.error(err.message, err.stack);
			this.mqttClient.end();
		});

		// Connection callback
		this.mqttClient.on('connect', async (success) => {
			this.logger.debug(`[mqttConnect] Mqtt client connected ${success}`);
		});

		// mqtt subscriptions
		this.mqttClient.subscribe('almond/test', { qos: 0 });

		// When a message arrives, console.log it
		this.mqttClient.on('message', (topic, message) => {
			this.logger.debug(message.toString());
		});

		this.mqttClient.on('close', async (close) => {
			this.logger.debug(`[mqttClose] Mqtt client disconnected ${close}`);
		});
	}

	public async deviceConnectivityLog(
		activityLogInstance: ActivityLogService,
		req: Request,
		msg: string,
	): Promise<void> {
		try {
			const user = req.currentUser;
			const logActivityItems = deviceConnectionStatus(req, msg);
			await activityLogInstance.CreateActivityLog(logActivityItems, user);
		} catch (e) {
			this.logger.error('🔥 Error Creating Activity Log : %o', e);
		}
	}

	// Sends a mqtt message to topic: almond
	public async sendMessage(topic: string, message: string): Promise<void> {
		try {
			this.mqttClient.publish(topic, message);
			this.logger.warn(message);
		} catch (e) {
			this.logger.error(e.message, e.stack);
			throw e;
		}
	}
}
