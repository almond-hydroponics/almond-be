import { Inject, Service } from 'typedi';
import { IActivityLog, IActivityLogDto } from '../interfaces/IActivityLog';
import { AppLogger } from '../app.logger';
import { IUser } from '../interfaces/IUser';

@Service()
export default class ActivityLogService {
	private logger = new AppLogger(ActivityLogService.name);

	constructor(
		@Inject('activityLogModel')
		private activityLogModel: Models.ActivityLogModel,
	) {}

	public async CreateActivityLog(
		activityLogDto: IActivityLogDto,
		user: any,
	): Promise<{
		activityLog: IActivityLog;
	}> {
		try {
			this.logger.log('[activityLog] Creating Activity Log');
			const activityLogItem = {
				...activityLogDto,
				user: user._id,
			};
			const activityLogX = await this.activityLogModel.create(activityLogItem);
			const activityLog = activityLogX.toObject();
			return { activityLog };
		} catch (e) {
			this.logger.error(e.message, e.stack);
			throw e;
		}
	}

	public async GetActivityLogs(user: IUser): Promise<IActivityLog[]> {
		try {
			this.logger.log('[getActivityLogs] Fetching Activity Logs');
			return this.activityLogModel
				.find({ user: { $eq: user._id }, actionDesc: { $regex: /^Manual/ } })
				.select({
					actionDesc: 1,
					createdAt: 1,
				}) // select actionDesc and createdAt fields
				.sort({ createdAt: -1 }) // sort in descending order
				.limit(10) // limit to 10 requests only
				.exec();
		} catch (e) {
			this.logger.error(e.message, e.stack);
			throw e;
		}
	}
}
