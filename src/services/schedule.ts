import {Inject, Service} from 'typedi';
import {ISchedule, IScheduleInputDTO} from '../interfaces/ISchedule'

@Service()
export default class ScheduleService {
  constructor(
    @Inject('scheduleModel') private scheduleModel,
    @Inject('logger') private logger,
  ) {}

  public async CreateSchedule(scheduleInputDTO: IScheduleInputDTO): Promise<{ schedule: ISchedule }> {
    try {
      this.logger.silly('Creating schedule db record');
      const scheduleRecord = await this.scheduleModel.create({
        ...scheduleInputDTO,
      });
      const schedule = scheduleRecord.toObject();
      return { schedule: schedule };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async GetSchedules() {
    try {
      return await this.scheduleModel.find();
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async GetScheduleById(pk) {
    try {
      return await this.scheduleModel.findById(pk)
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async DeleteScheduleById(pk) {
    try {
      return await this.scheduleModel.deleteOne({ '_id': Object(pk) })
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async EditSchedule(pk, scheduleInputDTO: IScheduleInputDTO): Promise<{ schedule: ISchedule }> {
    try {
      this.logger.silly('Editing schedule db record');
      await this.scheduleModel.updateOne(
        { _id: pk },
        { ...scheduleInputDTO }
      );
      return { schedule: await this.scheduleModel.findById(pk) };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
