import {Inject, Service} from 'typedi';
import {IActivityLog, IActivityLogDto} from '../interfaces/IActivityLog';
import {AppLogger} from '../loaders/logger';

@Service()
export default class ActivityLogService{
  private logger = new AppLogger(ActivityLogService.name);
  constructor(
    @Inject('activityLogModel') private activityLogModel,
  ) {}

  public async createActivityLog(activityLogDto: IActivityLogDto, user): Promise<{
    activityLog: IActivityLog }> {
    try {
      this.logger.log('Creating Activity Log...');
      const activityLogItem = {
        ...activityLogDto,
        user: user._id
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
      let data = [];
      await this.activityLogModel.find({ user: user._id}, function (err, activityLogModel) {
        activityLogModel.forEach( function (logs) {
          let resObject = {
            _id : logs._id,
            createdAt : logs.createdAt,
            updatedAt : logs.updatedAt,
            type:  `INFO : ${logs.actionType}`,
            message: logs.actionDesc
          };
          data.push(resObject)
        })
      });
      return data;
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  }
}
