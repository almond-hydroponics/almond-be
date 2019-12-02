import {Inject, Service} from 'typedi';
import {IScheduleOverride, IScheduleOverrideInputDTO} from '../interfaces/IScheduleOverride'

@Service()
export default class ScheduleOverrideService {
  constructor(
    @Inject('scheduleOverrideModel') private scheduleOverrideModel,
    @Inject('logger') private logger,
  ) {}


  public async GetScheduleOverride(user) {
    try {
      return await this.scheduleOverrideModel
        .find({ user: user._id  })
        .populate({ path: 'user' });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async EditScheduleOverride(
    scheduleInputOverrideDTO: IScheduleOverrideInputDTO, user): Promise<{ scheduleOverride: IScheduleOverride }> {
    try {
      this.logger.silly('Editing schedule override db record');
      const scheduleOverrideItem = {
        ...scheduleInputOverrideDTO,
        user: user._id
      };
      const options = { upsert: true, new: true, setDefaultsOnInsert: true };
      return await this.scheduleOverrideModel.findOneAndUpdate(
        { user: user._id },
        scheduleOverrideItem, options)
        .populate({ path: 'user'  });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
