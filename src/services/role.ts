import { Inject, Service } from 'typedi';
import { IRole, IRoleInputDTO } from '../interfaces/IRole';
import { AppLogger } from '../loaders/logger';

@Service()
export default class RoleService {
  private logger = new AppLogger(RoleService.name);

  constructor(
    @Inject('roleModel') private roleModel,
  ) {
  }

  public async CreateRole(roleInputDTO: IRoleInputDTO): Promise<{ role: IRole }> {
    try {
      this.logger.debug('Creating role db record');
      const roleItem = {
        ...roleInputDTO,
        resourceAccessLevels: roleInputDTO.resourceAccessLevels.map(accessLevels => ({
          permissions: accessLevels.permissionIds,
          resource: accessLevels.resourceId,
        })),
      };

      const roleRecord = await this.roleModel.create(roleItem);
      const role = roleRecord.toObject();
      return { role };
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  }

  public async GetRoles() {
    try {
      return this.roleModel
        .find()
        .populate('resourceAccessLevels.resource')
        .populate('resourceAccessLevels.permissions');
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  }

  public async DeleteRoleById(roleID) {
    try {
      return this.roleModel.deleteOne({ '_id': Object(roleID) }).exec();
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  }

  public async EditRole(roleId, roleInputDTO: IRoleInputDTO): Promise<{ role: IRole }> {
    try {
      const roleItem = {
        ...roleInputDTO,
        _id: roleId,
      };
      return this.roleModel.findOneAndUpdate(
        { _id: roleId }, roleItem, { new: true });
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  }
}
