import { Inject, Service } from 'typedi';
import { IRole, IRoleInputDTO } from '../interfaces/IRole';
import { AppLogger } from '../app.logger';
import { DeepPartial } from '../helpers/database';

@Service()
export default class RoleService {
	private logger = new AppLogger(RoleService.name);

	constructor(@Inject('roleModel') private roleModel: Models.RoleModel) {}

	public async CreateRole(
		roleInputDTO: IRoleInputDTO,
	): Promise<{ role: DeepPartial<IRole> }> {
		try {
			this.logger.debug('[createRole] Creating role db record');
			const roleItem = {
				...roleInputDTO,
				resourceAccessLevels: roleInputDTO.resourceAccessLevels.map(
					(accessLevels) => ({
						permissions: accessLevels.permissionIds,
						resource: accessLevels.resourceId,
					}),
				),
			};

			const roleRecord = await this.roleModel.create(roleItem as any);
			const role = roleRecord.toObject();
			return { role };
		} catch (e) {
			this.logger.error(e.message, e.stack);
			throw e;
		}
	}

	public async GetRoles(): Promise<IRole[]> {
		try {
			this.logger.debug('[getRoles] Fetching roles from db');
			return this.roleModel
				.find()
				.populate('resourceAccessLevels.resource')
				.populate('resourceAccessLevels.permissions');
		} catch (e) {
			this.logger.error(e.message, e.stack);
			throw e;
		}
	}

	public async DeleteRoleById(roleID: string): Promise<IRole | void> {
		try {
			this.logger.debug('[deleteRole] Delete role db record');
			return this.roleModel.deleteOne({ _id: Object(roleID) }).exec();
		} catch (e) {
			this.logger.error(e.message, e.stack);
			throw e;
		}
	}

	public async EditRole(
		roleId: string,
		roleInputDTO: IRoleInputDTO,
	): Promise<{ role: IRole }> {
		try {
			this.logger.debug('[editRole] Editing role in db record');
			const roleItem = {
				...roleInputDTO,
				_id: roleId,
			};
			return this.roleModel.findOneAndUpdate({ _id: roleId }, roleItem as any, {
				new: true,
			});
		} catch (e) {
			this.logger.error(e.message, e.stack);
			throw e;
		}
	}
}
