import { Service, Inject } from 'typedi';
import { IUser } from '../interfaces/IUser';
import smtpTransport from '../config/nodemailer';
import { AppLogger } from '../loaders/logger';
import { verificationEmail, recoverPasswordEmail } from '../mail';

@Service()
export default class MailerService {
  private logger = new AppLogger(MailerService.name);
  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
  ) {}

  public async SendWelcomeEmail(user: Partial<IUser>) {
    try {
      const messageStatus = await smtpTransport.sendMail({
        from: '"Almond" <almond.noreply@gmail.com>',
        to: user.email,
        subject: 'Welcome to My Almond!!',
        html: verificationEmail(user),
      });

      return { delivered: 1, status: 'ok' };
    } catch (e) {
      this.logger.error(e.message, e.stack);
    }
  }

  public StartEmailSequence(sequence: string, user: Partial<IUser>) {
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
