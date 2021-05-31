import { Inject, Service } from 'typedi';
import {
	IScheduleOverride,
	IScheduleOverrideInputDTO,
} from '../interfaces/IScheduleOverride';
import { IUser } from '../interfaces/IUser';
import { AppLogger } from '../app.logger';
import { DeepPartial } from '../helpers/database';

@Service()
export default class ScheduleOverrideService {
	private logger = new AppLogger(ScheduleOverrideService.name);

	constructor(
		@Inject('scheduleOverrideModel')
		private scheduleOverrideModel: Models.ScheduleOverride,
	) {}

	public async GetScheduleOverride(
		user: IUser,
		device: string,
	): Promise<IScheduleOverride> {
		try {
			this.logger.debug(
				'[getScheduleOverride] Fetch schedule override db record',
			);
			return this.scheduleOverrideModel.findOne({
				device: { $eq: device },
				user: { $eq: user._id },
			});
		} catch (e) {
			this.logger.error(e.message, e.stack);
			throw e;
		}
	}

	public async EditScheduleOverride(
		scheduleInputOverrideDTO: DeepPartial<IScheduleOverrideInputDTO>,
		user: DeepPartial<IUser>,
	): Promise<{ scheduleOverride: IScheduleOverride }> {
		try {
			this.logger.debug(
				'[editScheduleOverride] Editing schedule override db record',
			);
			const scheduleOverrideItem = {
				...scheduleInputOverrideDTO,
				user: user._id,
			};
			const options = { upsert: true, new: true, setDefaultsOnInsert: true };
			const scheduleOverride =
				await this.scheduleOverrideModel.findOneAndUpdate(
					{ user: { $eq: user._id } },
					scheduleOverrideItem,
					options,
				);
			// .populate({ path: 'user' });
			return { scheduleOverride };
		} catch (e) {
			this.logger.error(e.message, e.stack);
			throw e;
		}
	}
}
