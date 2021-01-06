import { Service, Inject } from 'typedi';
import * as Str from '@supercharge/strings';
import { mail, renderTemplate } from '../../config/nodemailer';
import { IUser } from '../interfaces/IUser';
import { AppLogger } from '../app.logger';
import redisClient from '../loaders/redis';
import { config } from '../../config';
// import { createToken } from './jwt';

@Service()
export default class MailerService {
	private logger = new AppLogger(MailerService.name);
	constructor(@Inject('userModel') private userModel: Models.UserModel) {}

	public async SendWelcomeEmail(user: Partial<IUser>): Promise<any> {
		try {
			this.logger.debug(
				`[onSendWelcomeEmail] Sending verification email for user ${user.email}`,
			);
			const messageStatus = await mail({
				to: user.email,
				subject: 'Welcome to Almond Hydroponics',
				html: await renderTemplate(`/mail/verify_registration.twig`, {
					user,
					config,
					token: user.verificationToken,
				}),
			});

			if (!messageStatus) {
				this.logger.error('Error:', "Couldn't send welcome message to user.");
				throw new Error("Couldn't send welcome message to user.");
			}
			this.logger.debug(`[onSendWelcomeEmail] Verification email sent`);
			return { delivered: 1, status: 'ok' };
		} catch (e) {
			this.logger.error(e.message, e.stack);
		}
	}

	public async SendRecoveryPasswordEmail(email: string) {
		try {
			const userRecord = await this.userModel.findOne({ email });

			if (!userRecord) {
				const err = new Error('Invalid email');
				err['status'] = 400;
				throw err;
			}

			if (userRecord.googleId) {
				return { google: true };
			}

			//Generate token for password reset
			const token = Str.random(32);

			const HASH_EXPIRATION_TIME = 14400; //4 hours

			//Set token in Redis to expire in 4 hours
			const redisResponse = await redisClient.set(
				`rPasswordHash::${token}`,
				userRecord.email,
				'EX',
				HASH_EXPIRATION_TIME,
			);

			if (!redisResponse) {
				throw new Error('Failed to add hash to Redis');
			}

			//Send email to user
			const messageStatus = await mail({
				from: '"Almond Hydroponics" <almond.noreply@gmail.com>',
				to: userRecord.email,
				subject: 'My Study Planner recover password link',
				html: await renderTemplate(`/mail/verify_registration.twig`, {
					userRecord,
					config,
					token,
				}),
			});

			if (!messageStatus)
				throw new Error("Couldn't send welcome message to user.");

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