import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import * as Str from '@supercharge/strings';
import jwt from 'jsonwebtoken';
import { Inject, Service } from 'typedi';
import { config } from '../../config';
import {
	EventDispatcher,
	EventDispatcherInterface,
} from '../decorators/eventDispatcher';
import { IProfile, IUser, IUserInputDTO } from '../interfaces/IUser';
import { AppLogger } from '../app.logger';
import events from '../subscribers/events';
import MailerService from './mailer';
// import isArrayNotNull from '../utils/checkArrayEmpty';
import { createAuthToken } from './jwt';
import { IToken } from '../interfaces/IToken';
import { DeepPartial } from '../helpers/database';

const { almond_admin } = config;

@Service()
export default class AuthService {
	private logger = new AppLogger(AuthService.name);

	constructor(
		@Inject('userModel') private userModel: Models.UserModel,
		@Inject('roleModel') private roleModel: Models.RoleModel,
		// @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
		private mailer: MailerService,
	) {
		this.userModel = userModel;
		this.roleModel = roleModel;
	}

	public async SignUp(
		userInputDTO: IUserInputDTO,
	): Promise<{ verificationToken: string }> {
		try {
			const salt = randomBytes(32);
			const hashedPassword = await argon2.hash(userInputDTO.password, { salt });
			this.logger.log('[signup] Creating user db record');

			const verificationToken = Str.random(32);

			const userRecord = await this.userModel.create({
				...userInputDTO,
				salt: salt.toString('hex'),
				password: hashedPassword,
				roles:
					userInputDTO.email === almond_admin
						? ['5e4703d62faee61d8ede2d65', '5e555801465ca301b1143b90']
						: ['5e4703d62faee61d8ede2d65'],
				currentRole: '5e4703d62faee61d8ede2d65',
				verificationToken,
			});

			if (!userRecord) {
				this.logger.error('Signup Error:', 'User cannot be created');
				throw new Error('User cannot be created');
			}
			await this.mailer.SendWelcomeEmail(userRecord);
			// await this.eventDispatcher.dispatch(events.user.signUp, userRecord);

			// /**
			//  * @TODO This is not the best way to deal with this
			//  * There should exist a 'Mapper' layer
			//  * that transforms data from layer to layer
			//  * but that's too over-engineering for now
			//  */
			// const user = userRecord
			// 	.populate({ path: 'roles', select: 'title' })
			// 	.toObject();
			return { verificationToken };
		} catch (e) {
			this.logger.error(e.message, e.stack);
			const error = new Error(
				`User ${userInputDTO.email} already exists. Kindly login`,
			);
			if (e.code === 11000) {
				error['status'] = 409;
			}
			throw error;
		}
	}

	public async VerifyEmail(
		email: string,
		token: string,
	): Promise<{ user: DeepPartial<IUser> }> {
		try {
			const userRecord = await this.userModel.findOneAndUpdate(
				{ email, verificationToken: token },
				{ $set: { isVerified: true } },
			);

			if (!userRecord) {
				const err = new Error('Invalid token');
				err['status'] = 400;
				this.logger.error(err.message, err.stack);
			}

			const user = userRecord.toObject();
			Reflect.deleteProperty(user, 'password');

			return { user };
		} catch (e) {
			this.logger.error(e.message, e.stack);
			throw e;
		}
	}

	public async SignIn(
		email: string,
		password: string,
	): Promise<{ user: DeepPartial<IUser>; token: IToken }> {
		const userRecord = await this.userModel
			.findOne({ email })
			.populate({ path: 'roles', select: 'title' });

		if (!userRecord) {
			const error = new Error('User does not exist. Kindly register');
			error['status'] = 404;
			throw error;
		}

		// We use verify from argon2 to prevent 'timing based' attacks
		this.logger.silly('Checking password');
		const validPassword = await argon2.verify(userRecord.password, password);

		if (validPassword) {
			const token = createAuthToken(userRecord);
			const user = userRecord.toObject();
			Reflect.deleteProperty(user, 'password');
			Reflect.deleteProperty(user, 'salt');
			Reflect.deleteProperty(user, 'verificationToken');

			return { user, token };
		} else {
			const error = new Error('Invalid Password');
			error['status'] = 400;
			throw error;
		}
	}

	public async LoginAs(email: string): Promise<any> {
		const userRecord = await this.userModel.findOne({ email });
		this.logger.silly('Finding user record...');
		if (!userRecord) {
			throw new Error('User not found');
		}
		return {
			user: {
				email: userRecord.email,
				name: userRecord.firstName,
			},
			token: createAuthToken(userRecord),
		};
	}

	public async SocialLogin(profile: IProfile): Promise<IUser | string> {
		try {
			let userRecord = await this.userModel
				.findOne({ email: profile.email })
				.populate({ path: 'roles', select: 'title' })
				.exec();

			if (!userRecord) {
				const data = profile._json;
				const userInfo = {
					googleId: profile.id,
					firstName: data.given_name,
					lastName: data.family_name,
					photo: data.picture,
					email: data.email,
					isVerified: data.email_verified,
					roles:
						data.email === almond_admin
							? ['5e4703d62faee61d8ede2d65', '5e555801465ca301b1143b90']
							: ['5e4703d62faee61d8ede2d65'],
					currentRole: '5e4703d62faee61d8ede2d65',
				};
				userRecord = await this.userModel.create(userInfo);
				userRecord = await userRecord
					.populate({ path: 'roles', select: 'title' })
					.execPopulate();

				await this.roleModel
					.findOneAndUpdate(
						{ _id: userRecord.roles },
						{ $inc: { userCount: 1 } },
						{ new: true },
					)
					.exec();
			}
			return userRecord;
		} catch (e) {
			this.logger.error(e.message, e.stack);
			throw new Error(
				'error while authenticating google user: ' + JSON.stringify(e),
			);
		}
	}

	public async UserProfile(id: string): Promise<DeepPartial<IUser>> {
		try {
			this.logger.debug('[userProfile] Fetching user details');
			const userRecord = await this.userModel
				.findById(id)
				.populate({
					path: 'roles',
					select: '_id title description resourceAccessLevels',
					populate: {
						path:
							'resourceAccessLevels.resource resourceAccessLevels.permissions',
					},
				})
				.populate({ path: 'activeDevice' })
				.populate({ path: 'currentRole', select: 'title' })
				.populate({ path: 'devices' })
				.exec();

			const user = userRecord.toObject();
			Reflect.deleteProperty(user, 'password');
			Reflect.deleteProperty(user, 'salt');
			Reflect.deleteProperty(user, 'verificationToken');

			return user;
		} catch (e) {
			this.logger.error(e.message, e.stack);
			throw e;
		}
	}

	public async UpdateCurrentUserRole(
		id: string,
		userDetails: DeepPartial<IUserInputDTO>,
	): Promise<IUser> {
		try {
			this.logger.debug('Updating user role');
			let userRecord;
			userRecord = await this.userModel.findOne({ _id: { $eq: id } });
			this.logger.debug(JSON.stringify(userRecord));
			this.logger.debug(JSON.stringify(userDetails));

			const roleExists = userRecord.roles.includes(userDetails.role);
			this.logger.debug(JSON.stringify(roleExists));
			if (!roleExists) {
				await this.userModel.findByIdAndUpdate(
					id,
					{ $push: { roles: { $each: [userDetails.role] } } },
					{ new: true },
				);

				// Check when a user role is removed????
				await this.roleModel
					.findOneAndUpdate(
						{ _id: userDetails.role },
						{ $inc: { userCount: 1 } },
						{ new: true },
					)
					.exec();
			}

			userRecord = await this.userModel
				.findByIdAndUpdate(id, { currentRole: userDetails.role }, { new: true })
				.populate({
					path: 'roles',
					select: '_id title description resourceAccessLevels',
					populate: {
						path:
							'resourceAccessLevels.resource resourceAccessLevels.permissions',
					},
				})
				.populate({ path: 'currentRole', select: 'title' })
				.populate({ path: 'activeDevice' })
				.populate({ path: 'devices' })
				.exec();

			const user = userRecord.toObject();
			this.logger.debug(JSON.stringify(user));
			Reflect.deleteProperty(user, 'password');
			Reflect.deleteProperty(user, 'salt');
			Reflect.deleteProperty(user, 'verificationToken');

			return user;
		} catch (e) {
			this.logger.error(e.message, e.stack);
			throw e;
		}
	}

	public async GetUsers(): Promise<IUser[]> {
		try {
			this.logger.debug('[getUsers] Fetching all user from record');
			return this.userModel
				.find()
				.populate({ path: 'roles', select: 'title' })
				.populate({ path: 'currentRole', select: 'title' })
				.populate({ path: 'devices', select: 'id' });
		} catch (e) {
			this.logger.error(e.message, e.stack);
			throw e;
		}
	}

	public async deserializeUser(email: string): Promise<IUser> {
		const userRecord = await this.userModel.findOne({ email });
		this.logger.silly('[deserializeUser] Finding user record');

		if (!userRecord) throw new Error('User not found');

		return userRecord;
	}

	// public generateToken(user: IUser) {
	// 	const today = new Date();
	// 	const exp = new Date(today);
	// 	exp.setDate(today.getDate() + 60);

	// 	/**
	// 	 * A JWT means JSON Web Token, so basically it's a json that is _hashed_ into a string
	// 	 * The cool thing is that you can add custom properties a.k.a metadata
	// 	 * Here we are adding the userId, role and name
	// 	 * Beware that the metadata is public and can be decoded without _the secret_
	// 	 * but the client cannot craft a JWT to fake a userId
	// 	 * because it doesn't have _the secret_ to sign it
	// 	 */
	// 	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// 	// @ts-expect-error
	// 	const role = user.roles.reduce(
	// 		(obj, role) => Object.assign(obj, { [role.title]: role._id }),
	// 		{},
	// 	);
	// 	const userData = {
	// 		role,
	// 		_id: user._id, // We are gonna use this in the middleware 'isAuth'
	// 		name: user.name,
	// 		photo: user.photo,
	// 		email: user.email,
	// 		isVerified: user.isVerified,
	// 		deviceVerified: isArrayNotNull(user.devices)
	// 			? user.devices[0].verified
	// 			: false,
	// 		activeDevice: user.activeDevice,
	// 	};

	// 	return jwt.sign(
	// 		{
	// 			userData,
	// 			iat: Date.now(),
	// 			exp: exp.getTime() / 1000,
	// 			iss: 'almond.com',
	// 			aud: 'almond users',
	// 		},
	// 		jwtSecret,
	// 	);
	// }
}
