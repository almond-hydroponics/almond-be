import { Service, Inject } from 'typedi';
// import { mail } from '../config/nodemailer';
import { IUser } from '../interfaces/IUser';
import { AppLogger } from '../loaders/logger';
// import { verificationEmail } from '../mail';

@Service()
export default class MailerService {
  private logger = new AppLogger(MailerService.name);

  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
  ) {
  }

  public async SendWelcomeEmail(user: Partial<IUser>) {
    try {
      // const messageStatus = await mail({
      //   to: user.email,
      //   subject: 'Welcome to My Almond!!',
      //   html: verificationEmail(user),
      // });

      return { delivered: 1, status: 'ok' };
    } catch (e) {
      this.logger.error(e.message, e.stack);
    }
  }

  public async StartEmailSequence(sequence: string, user: Partial<IUser>) {
    try {
      if (!user.email) {
        this.logger.error('No email provided', 'error');
      }
      return { delivered: 1, status: 'ok' };
    } catch (e) {
      this.logger.error(e.message, e.stack);
    }
  }
}
