import { Inject, Service } from 'typedi';
import {
	IScheduleOverride,
	IScheduleOverrideInputDTO,
} from '../interfaces/IScheduleOverride';
import { IUser } from '../interfaces/IUser';
import { AppLogger } from '../app.logger';

@Service()
export default class ScheduleOverrideService {
	private logger = new AppLogger(ScheduleOverrideService.name);

	constructor(@Inject('scheduleOverrideModel') private scheduleOverrideModel) {}

	public async GetScheduleOverride(user: IUser, device: string | any) {
		try {
			return await this.scheduleOverrideModel.findOne({
				device: { $eq: device },
				user: { $eq: user._id },
			});
		} catch (e) {
			this.logger.error(e.message, e.stack);
			throw e;
		}
	}

	public async EditScheduleOverride(
		scheduleInputOverrideDTO: IScheduleOverrideInputDTO,
		user,
	): Promise<{ scheduleOverride: IScheduleOverride }> {
		try {
			this.logger.debug('Editing schedule override db record');
			const scheduleOverrideItem = {
				...scheduleInputOverrideDTO,
				user: user._id,
			};
			const options = { upsert: true, new: true, setDefaultsOnInsert: true };
			return this.scheduleOverrideModel
				.findOneAndUpdate(
					{ user: { $eq: user._id } },
					scheduleOverrideItem,
					options,
				)
				.populate({ path: 'user' });
		} catch (e) {
			this.logger.error(e.message, e.stack);
			throw e;
		}
	}
}
