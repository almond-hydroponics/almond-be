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
						logger.log('[connectivityWorker] Internet Connection Unavailable');
						const activityLogInstance = Container.get(ActivityLogService);
						try {
							const logActivityItems = internetConnectionStatus();
							await activityLogInstance.CreateActivityLog(
								logActivityItems,
								user,
							);
							logger.debug('[connectivityWorker] Activity Logged');
							// .then(
							// 	(resp) => {
							// 		logger.debug('Activity Logged');
							// 	},
							// 	(err) => {
							// 		logger.error('An Error Occurred ', err);
							// 	},
							// );
						} catch (e) {
							logger.error('🔥 error Creating Activity Log : %o', e.message);
						}
					}
				},
				(err) => {
					logger.error('🔥 Error with Internet Worker:', err);
				},
			);
		});
	}
}
