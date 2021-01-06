import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import jobsLoader from './jobs';
import { AppLogger } from '../app.logger';
import mongooseLoader from './mongoose';
// We have to import at least all the events once so they can be triggered
import './events';

import * as schedule from '../models/schedule';
import * as user from '../models/user';
import * as scheduleOverride from '../models/scheduleOverride';
import * as activityLog from '../models/activityLog';
import * as device from '../models/device';
import * as role from '../models/role';
import * as resource from '../models/resource';
import * as permissions from '../models/permissions';

export default async ({ expressApp }): Promise<void> => {
	const logger = new AppLogger('Loaders');
	const mongoConnection = await mongooseLoader();
	logger.log('✌️ Database loaded and connected!');

	/**
	 * We are injecting the mongoose models into the DI container.
	 * I know this is controversial but will provide a lot of flexibility at the time
	 * of writing unit tests, just go and check how beautiful they are!
	 */

	const scheduleModel = {
		name: 'scheduleModel',
		// Notice the require syntax and the '.default'
		model: schedule.default,
	};

	const userModel = {
		name: 'userModel',
		model: user.default,
	};

	const scheduleOverrideModel = {
		name: 'scheduleOverrideModel',
		model: scheduleOverride.default,
	};
	const activityLogModel = {
		name: 'activityLogModel',
		model: activityLog.default,
	};

	const deviceModel = {
		name: 'deviceModel',
		model: device.default,
	};

	const roleModel = {
		name: 'roleModel',
		model: role.default,
	};

	const resourceModel = {
		name: 'resourceModel',
		model: resource.default,
	};

	const permissionsModel = {
		name: 'permissionsModel',
		model: permissions.default,
	};

	// It returns the agenda instance because it's needed in the subsequent loaders
	const { agenda } = await dependencyInjectorLoader({
		mongoConnection,
		models: [
			scheduleModel,
			userModel,
			scheduleOverrideModel,
			deviceModel,
			activityLogModel,
			roleModel,
			resourceModel,
			permissionsModel,
			// whateverModel
		],
	});
	logger.log('✌️ Dependency Injector loaded');

	await jobsLoader({ agenda });
	logger.log('✌️ Jobs loaded');

	await expressLoader({ app: expressApp, agendaInstance: agenda });
	logger.log('✌️ Express loaded');
};
