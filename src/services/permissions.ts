import { Inject, Service } from 'typedi';
import { AppLogger } from '../loaders/logger';

@Service()
export default class PermissionService {
  private logger = new AppLogger(PermissionService.name);

  constructor(
    @Inject('permissionsModel') private permissionsModel,
  ) {
  }

  public async GetPermission() {
    try {
      this.logger.debug('Fetching all permissions db records');
      return this.permissionsModel.find();
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  }
}
