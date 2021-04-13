import { NextFunction, Request, Response, Router } from 'express';
import argon2 from 'argon2';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import passport from 'passport';
import { config } from '../../../config';
import { AppLogger } from '../../app.logger';
import AuthService from '../../services/auth';
import { IUserInputDTO } from '../../interfaces/IUser';
import middlewares from '../middlewares';
// import csrf from 'csurf';
import { createAuthToken } from '../../services/jwt';
import HttpError from '../../utils/httpError';

const logger = new AppLogger('Auth');
const auth = Router();

const { isAuth, checkRole, attachCurrentUser } = middlewares;
// const csrfProtection = csrf({ cookie: true });

export default (app: Router): void => {
	app.use('/auth', auth);

	/**
	 * @api {POST} api/auth/register
	 * @description Register a new user
	 * @access Public
	 */
	auth.post(
		'/register',
		celebrate({
			body: Joi.object({
				firstName: Joi.string().required(),
				lastName: Joi.string().required(),
				email: Joi.string().required(),
				password: Joi.string().min(6).required(),
			}),
		}),
		async (req: Request, res: Response, next: NextFunction) => {
			logger.debug(
				`[register] Calling Sign-Up endpoint with body: ${JSON.stringify(
					req.body.email,
				)}`,
			);
			try {
				const authServiceInstance = Container.get(AuthService);
				const { verificationToken } = await authServiceInstance.SignUp(
					req.body as IUserInputDTO,
				);
				passport.authenticate('local')(req, res, () => {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-expect-error
					req.session.cookie.expires = false;

					res.cookie('IS_LOGGED_IN', true, {
						httpOnly: false,
						domain: config.cookiesDomain,
					});
					return res.status(201).send({
						success: true,
						message:
							'Account registration was successful. Kindly check your email to verify your account before proceeding.',
						data: { verificationToken },
					});
				});
			} catch (e) {
				logger.error('🔥 error: %o', e.message);
				return next(e);
			}
		},
	);

	/**
	 * @route {POST} api/auth/verification
	 * @description Verify user account
	 * @access Public
	 */
	auth.get(
		'/verification',
		celebrate({
			query: Joi.object({
				email: Joi.string().required(),
				token: Joi.string().required(),
			}),
		}),
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const authServiceInstance = Container.get(AuthService);
				await authServiceInstance.VerifyEmail(
					req.query.email as string,
					req.query.token as string,
				);

				res.redirect(`${config.siteUrl}/login`);
			} catch (e) {
				logger.error('🔥 error: %o', e.message);
				return next(e);
			}
		},
	);

	/**
	 * @route {POST} api/auth/login
	 * @description Login a new user
	 * @access Public
	 */
	auth.post(
		'/login',
		celebrate({
			body: Joi.object({
				email: Joi.string().required(),
				password: Joi.string().required(),
			}),
		}),
		async (req: Request, res: Response, next: NextFunction) => {
			logger.debug(
				`[login] Calling Sign-In endpoint for account: ${JSON.stringify(
					req.body.email,
				)}`,
			);
			try {
				const { email, password } = req.body;
				const authServiceInstance = Container.get(AuthService);
				const { user, token } = await authServiceInstance.SignIn(
					email,
					password,
				);
				return res.status(200).send({
					success: true,
					message: 'Account login successful',
					data: { user, token },
				});
			} catch (e) {
				logger.error('🔥 error: %o', e.message);
				return next(e);
			}
		},
	);

	/**
	 * @route {POST} api/auth/user/login-as
	 * @description Login as an admin or maintenance person
	 * @access Public
	 */
	auth.post(
		'/user/login-as',
		isAuth,
		attachCurrentUser,
		checkRole('admin'),
		async (req: Request, res: Response) => {
			try {
				const { email } = req.body.user;
				const authServiceInstance = Container.get(AuthService);
				const { user, token } = await authServiceInstance.LoginAs(email);
				return res.status(200).json({ user, token }).end();
			} catch (e) {
				logger.error('Error in login as user: ', e.message);
				return res.json(e).status(500).end();
			}
		},
	);

	/**
	 * @api {GET} api/auth/google/login
	 * @description Social authentication with google
	 * @access Public
	 */
	auth.get(
		'/google',
		passport.authenticate('google', { scope: ['profile', 'email'] }),
	);

	/**
	 * @api {GET} api/auth/google/callback
	 * @description Google callback redirect url
	 * @access Public on request
	 */
	auth.get(
		'/google/callback',
		passport.authenticate('google'),
		(req: Request, res: Response, next: NextFunction) => {
			try {
				const token = createAuthToken(req.user);
				res.cookie('jwt-token', token.accessToken, {
					httpOnly: false,
					domain: config.cookiesDomain,
				});
				res.redirect(`${config.siteUrl}?socialToken=${token.accessToken}`);
				// res.redirect(config.siteUrl);
			} catch (e) {
				logger.error('🔥 error: %o', e.stack);
				return next(e);
			}
		},
	);

	/**
	 * @TODO Let's leave this as a place holder for now
	 * The reason for a logout route could be deleting a 'push notification token'
	 * so the device stops receiving push notifications after logout.
	 *
	 * Another use case for advance/enterprise apps, you can store a record of the jwt token
	 * emitted for the expressSession and add it to a black list.
	 * It's really annoying to develop that but if you had to, please use Redis as your data store
	 */
	auth.post(
		'/logout',
		middlewares.isAuth,
		(req: Request, res: Response, next: NextFunction) => {
			logger.debug('[logout] Calling Sign-Out endpoint');
			try {
				// @TODO AuthService.Logout(req.user) do some clever stuff
				return res.status(200).end();
			} catch (e) {
				logger.error('🔥 error %o', e);
				return next(e);
			}
		},
	);
};
