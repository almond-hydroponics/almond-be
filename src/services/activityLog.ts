import {Container, Inject, Service} from "typedi";
import {IActivityLog, IActivityLogDto} from "../interfaces/IActivityLog";

@Service()
export default class ActivityLogService{

  constructor(
    @Inject('activityLogModel') private activityLogModel,
    @Inject('logger') private logger
  ){}

  public async CreateActivityLog(activityLogDto: IActivityLogDto, user): Promise<{ activityLog: IActivityLog }> {
    try {
      this.logger.info('Creating Activity Log...');
      const activityLogItem = {
        ...activityLogDto
      };

      // Create Activity log doc and return the activityLogObject  back
      const activityLogDoneDeal = await this.activityLogModel.create(activityLogItem);
      const activityLog = activityLogDoneDeal.toObject();
      return { activityLog: activityLog };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
