import { Inject, Service } from 'typedi';
import { AppLogger } from '../loaders/logger';

@Service()
export default class ResourceService {
	private logger = new AppLogger(ResourceService.name);

	constructor(@Inject('resourceModel') private resourceModel) {}

	public async GetResources() {
		try {
			this.logger.debug('Fetching all resources db records');
			return this.resourceModel.find();
		} catch (e) {
			this.logger.error(e.message, e.stack);
			throw e;
		}
	}
}
