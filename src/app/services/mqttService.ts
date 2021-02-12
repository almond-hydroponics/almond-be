// import fs from 'fs';
// import path from 'path';
import mqtt from 'mqtt';
import { Service } from 'typedi';
import { config } from '../../config';
import { AppLogger } from '../app.logger';
import ActivityLogService from './activityLog';
import { Request } from 'express';
import { deviceConnectionStatus } from '../api/middlewares/logActivity';
import { IError } from '../shared/IError';

// const KEY = fs.readFileSync(
// 	path.join(__dirname, '../..', 'certificates', '/tls-key.pem'),
// );
// const CERT = fs.readFileSync(
// 	path.join(__dirname, '../..', 'certificates', '/tls-cert.crt'),
// );
// const TRUSTED_CA = fs.readFileSync(
// 	path.join(__dirname, '../..', 'certificates', '/crt-ca.crt'),
// );

// const { host, password, protocol, port, user } = config.mqtt;

// const options = {
// 	port,
// 	host,
// 	user,
// 	protocol,
// 	password,
// 	key: KEY,
// 	cert: CERT,
// 	ca: TRUSTED_CA,
// 	rejectUnauthorized: true,
// };

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
		this.mqttClient.on('connect', async () => {
			this.logger.debug('[mqttConnect] Mqtt client connected');
		});

		// mqtt subscriptions
		this.mqttClient.subscribe('almond/test', { qos: 0 });

		// When a message arrives, console.log it
		this.mqttClient.on('message', (topic, message) => {
			this.logger.debug(message.toString());
		});

		this.mqttClient.on('close', async (close) => {
			this.logger.debug('[mqttClose] Mqtt client disconnected');
		});
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
