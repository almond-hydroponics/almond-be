import { Container, Inject, Service } from 'typedi';
import { ISchedule, IScheduleInputDTO } from '../interfaces/ISchedule';
import { IUser } from '../interfaces/IUser';
import { AppLogger } from '../app.logger';
import ActivityLogService from './activityLog';
import { DeepPartial } from '../helpers/database';
import { IActivityLog } from '../interfaces/IActivityLog';
import Bluebird from 'bluebird';

@Service()
export default class ScheduleService {
	private logger = new AppLogger(ScheduleService.name);
	private activityLogInstance = Container.get(ActivityLogService);

	constructor(
		@Inject('scheduleModel') private scheduleModel: Models.ScheduleModel,
	) {}

	public async CreateSchedule(
		scheduleInputDTO: IScheduleInputDTO,
		user: IUser,
	): Promise<{ schedule: DeepPartial<ISchedule> }> {
		try {
			this.logger.debug('[createSchedule] Creating schedule db record');
			// let response: IActivityLog[] = [];
			const scheduleRecord = await this.scheduleModel.create({
				...scheduleInputDTO,
				user: user._id,
				device: scheduleInputDTO.device,
			});
			const schedule = scheduleRecord.toObject();
			// await this.activityLogInstance.GetActivityLogs(user).then((res) => {
			// 	response = res;
			// });
			// schedule.activityHistory = response;
			return { schedule };
		} catch (e) {
			this.logger.error(e.message, e.stack);
			throw e;
		}
	}

	public async GetSchedules(user: IUser, device: string): Promise<ISchedule[]> {
		try {
			this.logger.debug(
				`[getSchedules] Fetching schedules records for ${device}`,
			);
			return this.scheduleModel.find({
				user: { $eq: user._id },
				device: { $eq: device },
			});
		} catch (e) {
			this.logger.error(e.message, e.stack);
			throw e;
		}
	}

	public async GetScheduleById(
		scheduleId: string,
		user: IUser,
	): Promise<ISchedule> {
		try {
			this.logger.debug('[getSchedulesById] Fetching schedules record');
			return this.scheduleModel
				.findById({
					_id: scheduleId,
					user: user._id,
				})
				.populate({ path: 'device' });
		} catch (e) {
			this.logger.error(e.message, e.stack);
			throw e;
		}
	}

	public async DeleteScheduleById(
		scheduleId: string,
		user: IUser,
	): Promise<
		Bluebird<{ ok?: number; n?: number } & { deletedCount?: number }>
	> {
		try {
			this.logger.debug('[deleteScheduleById] Deleting schedule record');
			return this.scheduleModel
				.deleteOne({
					_id: Object(scheduleId),
					user: user._id,
				})
				.exec();
		} catch (e) {
			this.logger.error(e.message, e.stack);
			throw e;
		}
	}

	public async EditSchedule(
		scheduleId: string,
		scheduleInputDTO: IScheduleInputDTO,
		user: IUser,
	): Promise<{ schedule: ISchedule }> {
		try {
			this.logger.debug('[editSchedule] Editing schedule db record');
			const scheduleItem = {
				...scheduleInputDTO,
				_id: scheduleId,
				user: user._id,
				device: scheduleInputDTO.device,
			};
			const scheduleRecord = await this.scheduleModel.findOneAndUpdate(
				{ _id: scheduleId, user: user._id },
				scheduleItem,
				{ new: true },
			);
			const schedule = scheduleRecord.toObject();
			return { schedule };
		} catch (e) {
			this.logger.error(e.message, e.stack);
			throw e;
		}
	}
}
