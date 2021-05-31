import { Inject, Service } from 'typedi';
import { AppLogger } from '../app.logger';
import { DeepPartial } from '../helpers/database';
import { IPermissions } from '../interfaces/IPermissions';

@Service()
export default class PermissionService {
	private logger = new AppLogger(PermissionService.name);

	constructor(
		@Inject('permissionsModel')
		private permissionsModel: Models.PermissionsModel,
	) {}

	public async GetPermission(): Promise<DeepPartial<IPermissions[]>> {
		try {
			this.logger.debug(
				'[getPermissions] Fetching all permissions db records',
			);
			return this.permissionsModel.find();
		} catch (e) {
			this.logger.error(e.message, e.stack);
			throw e;
		}
	}
}
