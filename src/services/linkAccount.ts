import { Service, Inject } from 'typedi';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from '../decorators/eventDispatcher';
import { AppLogger } from '../loaders/logger';
import redisClient from '../loaders/redis';
import { IError } from '../shared/IError';


@Service()
export default class LinkAccountService {
  private logger = new AppLogger(LinkAccountService.name);

  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {
  }

  public async ConfirmGoogleToken(token: string): Promise<string> {
    try {
      const userId: string = await redisClient.getAsync(`gLinkAccountToken::${token}`);

      if (!userId) {
        const err: IError = new Error('Invalid credentials');
        err.status = 400;
        this.logger.error(err.message, err.stack);
      }

      return token;
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  }

  public async LinkGoogleAccount(token: string, email: string): Promise<string> {
    try {
      const userId: string = await redisClient.getAsync(`gLinkAccountToken::${token}`);

      if (!userId) {
        const err: IError = new Error('Invalid credentials');
        err.status = 400;
        this.logger.error(err.message, err.stack);
      }

      const userRecord = await this.userModel.findOneAndUpdate(
        { email },
        { $set: { googleId: userId, password: '', verified: true } },
      );

      if (!userRecord) {
        this.logger.error('Couldn\'t link account', 'error');
      }

      await redisClient.del(`gLinkAccountToken::${token}`);

      return 'success';
    } catch (e) {
      this.logger.error(e.message, e.stack);
      throw e;
    }
  }
}
