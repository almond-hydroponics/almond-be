import { Inject, Service } from 'typedi';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { AppLogger } from '../app.logger';
import redisClient from '../loaders/redis';

@Service()
export default class RecoverService {
	private logger = new AppLogger(RecoverService.name);

	constructor(@Inject('userModel') private userModel: Models.UserModel) {}

	public async ConfirmResetPasswordToken(token: string): Promise<string> {
		try {
			const userEmail: string = await redisClient.getAsync(
				`rPasswordHash::${token}`,
			);

			if (!userEmail) {
				const err = new Error('Invalid credentials. Kindly try again.');
				err['status'] = 400;
				throw err;
			}

			return token;
		} catch (e) {
			this.logger.error(e.message, e.stack);
		}
	}

	public async ChangePassword(
		token: string,
		password: string,
	): Promise<{ userEmail: string }> {
		try {
			const userEmail: string = await redisClient.getAsync(
				`rPasswordHash::${token}`,
			);

			this.logger.warn(JSON.stringify(userEmail));

			if (!userEmail) {
				const err = new Error('Invalid credentials. Kindly try again.');
				err['status'] = 400;
				throw err;
			}

			const salt = randomBytes(32);
			const hashedPassword = await argon2.hash(password, { salt });

			const userRecord = await this.userModel.findOneAndUpdate(
				{ email: userEmail },
				{ $set: { password: hashedPassword } },
			);

			if (!userRecord) {
				throw new Error("Couldn't update password");
			}

			await redisClient.del(`rPasswordHash::${token}`);

			const user = userRecord.toObject();
			Reflect.deleteProperty(user, 'password');

			return { userEmail };
		} catch (e) {
			this.logger.error(e);
			throw e;
		}
	}
}
