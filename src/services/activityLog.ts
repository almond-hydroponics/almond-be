import { Inject, Service } from 'typedi';
import { IActivityLog, IActivityLogDto } from '../interfaces/IActivityLog';
import { AppLogger } from '../loaders/logger';

@Service()
export default class ActivityLogService{
  private logger = new AppLogger(ActivityLogService.name);
  constructor(
    @Inject('activityLogModel') private activityLogModel,
  ) {}

  public async createActivityLog(activityLogDto: IActivityLogDto, user): Promise<{ activityLog: IActivityLog }> {
    try {
      this.logger.log('Creating Activity Log...');
      const activityLogItem = {
        ...activityLogDto,
        user: user._id
      };
      const activityLogDoneDeal = await this.activityLogModel.create(activityLogItem);
      const activityLog = activityLogDoneDeal.toObject();
      return { activityLog };
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  }
}
