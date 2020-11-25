import { Container } from 'typedi';
import { AppLogger } from '../loaders/logger';
import ActivityLogService from '../services/activityLog';

const logActivity = require('../api/middlewares/logActivity');

const cron = require('node-cron');
const isOnline = require('is-online');

let connectivity = false;
const logger = new AppLogger('Schedule');
const user: any = '';

async function status() {
	connectivity = await isOnline();
	return connectivity;
}

export default class ConnectivityWorker {
	public async internetStatusLogger() {
		cron.schedule('* 2 * * * *', function () {
			status().then(
				() => {
					if (!connectivity) {
						logger.log('Internet Connection Unavailable');
						const activityLogInstance = Container.get(ActivityLogService);
						try {
							const logActivityItems = logActivity.internetConnectionStatus();
							activityLogInstance
								.CreateActivityLog(logActivityItems, user)
								.then(
									(resp) => {
										logger.debug('Activity Logged');
									},
									(err) => {
										logger.error('An Error Occurred ', err);
									},
								);
						} catch (e) {
							// @ts-ignore
							logger.error('🔥 error Creating Activity Log : %o', e);
						}
					}
				},
				(err) => {
					console.log('Worker Encountered an Error');
					logger.error('🔥 Error with Internet Worker:', err);
				},
			);
		});
	}
}
