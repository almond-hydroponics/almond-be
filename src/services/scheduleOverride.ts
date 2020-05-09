import {Container, Inject, Service} from 'typedi';
import {IScheduleOverride, IScheduleOverrideInputDTO} from '../interfaces/IScheduleOverride'
import { IUser } from '../interfaces/IUser';
import { AppLogger } from '../loaders/logger';
import ActivityLogService from "./activityLog";

@Service()
export default class ScheduleOverrideService {
  private logger = new AppLogger(ScheduleOverrideService.name);
  private activityLogInstance = Container.get(ActivityLogService);

  constructor(
    @Inject('scheduleOverrideModel') private scheduleOverrideModel,
  ) {}


  public async GetScheduleOverride(user: IUser, device: string | any) {
    try {
      return await this.scheduleOverrideModel
        .find({
          user: user._id,
          device: device,
        })
        .populate({ path: 'user' });
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  }

  public async EditScheduleOverride(
    scheduleInputOverrideDTO: IScheduleOverrideInputDTO, user): Promise<{ scheduleOverride: IScheduleOverride }> {
    try {
      this.logger.silly('Editing schedule override db record');
      let response: any = '';
      await this.activityLogInstance.GetActivityLogs(user).then(
        res => {
          response = JSON.stringify(res);
          this.logger.warn(response);
        }
      );

      const scheduleOverrideItem = {
        ...scheduleInputOverrideDTO,
        user: user._id,
        activityHistory: response
        // device: scheduleInputOverrideDTO.deviceId
      };

      const options = { upsert: true, new: true, setDefaultsOnInsert: true };
      return await this.scheduleOverrideModel.findOneAndUpdate(
        { user: user._id, device: scheduleInputOverrideDTO.deviceId },
        scheduleOverrideItem, options)
        .populate({ path: 'user' });
    } catch (e) {
      this.logger.error(`Error  ${e.Message}`, e.stack);
      throw `Error  ${e.toString()}`;
    }
  }
}
