import { Inject, Service } from 'typedi';
import { IActivityLog, IActivityLogDto } from '../interfaces/IActivityLog';
import { AppLogger } from '../loaders/logger';

@Service()
export default class ActivityLogService {
  private logger = new AppLogger(ActivityLogService.name);

  constructor(
    @Inject('activityLogModel') private activityLogModel,
  ) {
  }

  public async CreateActivityLog(activityLogDto: IActivityLogDto, user): Promise<{
    activityLog: IActivityLog
  }> {
    try {
      this.logger.log('Creating Activity Log...');
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

  public async GetActivityLogs(user) {
    try {
      return this.activityLogModel.find({ user: { $eq: user._id } })
        .select({
          'actionDesc': 1,
          'createdAt': 1,
        })  // select actionDesc and createdAt fields
        .sort({ createdAt: -1 })  // sort in descending order
        .limit(20)  // limit to 10 requests only
        .exec();
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  }
}
