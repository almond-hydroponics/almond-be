import { Inject, Service } from 'typedi';
import { AppLogger } from '../app.logger';

@Service()
export default class DashboardService {
	private logger = new AppLogger(DashboardService.name);

	constructor(
		@Inject('userModel') private userModel: Models.UserModel,
		@Inject('deviceModel') private deviceModel: Models.DeviceModel,
	) {}

	public async GetDeviceSummary(): Promise<any> {
		try {
			this.DashboardLogger('GetDeviceSummary', 'devices');
			return await this.deviceModel.find().countDocuments();
		} catch (e) {
			throw e;
		}
	}

	public async GetUsersSummary(): Promise<any> {
		try {
			this.DashboardLogger('GetUsersSummary', 'users');
			return await this.userModel.find().countDocuments();
		} catch (e) {
			throw e;
		}
	}

	private DashboardLogger(method: string, msg: string) {
		this.logger.debug(`[${method}] Getting the number of ${msg}`);
	}
}
