import { Service, Inject } from 'typedi';
import { IUser } from '../interfaces/IUser';
import smtpTransport from '../config/nodemailer';
import { verificationEmail, recoverPasswordEmail } from '../mail';
import { Logger } from 'winston';
import cryptoRandomString = require('crypto-random-string');
import redisClient from '../loaders/redis';

@Service()
export default class MailerService {
  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    @Inject('logger') private logger: Logger
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
      this.logger.error(e);
    }
  }

  public StartEmailSequence(sequence: string, user: Partial<IUser>) {
    try {
      if (!user.email) {
        this.logger.error('No email provided');
    }
    return { delivered: 1, status: 'ok' };
    } catch (e) {
      this.logger.error(e);
    }
  }
}
