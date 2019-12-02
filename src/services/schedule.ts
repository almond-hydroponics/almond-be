import { Inject, Service } from 'typedi';
import { ISchedule, IScheduleInputDTO } from '../interfaces/ISchedule';
import { AppLogger } from '../loaders/logger';

@Service()
export default class ScheduleService {
  private logger = new AppLogger(ScheduleService.name);
  constructor(
    @Inject('scheduleModel') private scheduleModel,
  ) {}

  public async CreateSchedule(scheduleInputDTO: IScheduleInputDTO, user): Promise<{ schedule: ISchedule }> {
    try {
      this.logger.silly('Creating schedule db record');
      const scheduleItem = {
        ...scheduleInputDTO,
        user: user._id
      };
      const scheduleRecord = await this.scheduleModel.create(scheduleItem);
      const schedule = scheduleRecord.toObject();
      return { schedule: schedule };
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  }

  public async GetSchedules(user) {
    try {
      return await this.scheduleModel
        .find({ user: user._id })
        .populate({ path: 'user' });
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  }

  public async GetScheduleById(scheduleId: string, user) {
    try {
      return await this.scheduleModel
        .findById({ _id: scheduleId, user: user._id  })
        .populate({ path: 'user' });
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  }

  public async DeleteScheduleById(scheduleId, user) {
    try {
      return await this.scheduleModel.deleteOne({
        '_id': Object(scheduleId), user: user._id }).exec();
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  }

  public async EditSchedule(scheduleId, scheduleInputDTO: IScheduleInputDTO, user): Promise<{ schedule: ISchedule }> {
    try {
      this.logger.silly('Editing schedule db record');
      const scheduleItem = {
        ...scheduleInputDTO,
        _id: scheduleId,
        user: user._id
      };
      return await this.scheduleModel.findOneAndUpdate({
        _id: scheduleId,  user: user._id }, scheduleItem, { new: true })
        .populate({ path: 'user'  });
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  }
}
