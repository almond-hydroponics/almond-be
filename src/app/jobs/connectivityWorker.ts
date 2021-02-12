import { Container } from 'typedi';
import cron from 'node-cron';
import isOnline from 'is-online';

import { AppLogger } from '../app.logger';
import ActivityLogService from '../services/activityLog';
import { internetConnectionStatus } from '../api/middlewares/logActivity';

let connectivity = false;
const logger = new AppLogger('Schedule');
const user = '';

async function status() {
	connectivity = await isOnline();
	return connectivity;
}

export default class ConnectivityWorker {
	public async internetStatusLogger(): Promise<void> {
		cron.schedule('* 2 * * * *', function () {
			status().then(
				async () => {
					if (!connectivity) {
						logger.log('🔥 Worker Online');
					}
				},
				(err) => {
					logger.error('🔥 Error with Internet Worker:', err);
				},
			);
		});
	}
}
