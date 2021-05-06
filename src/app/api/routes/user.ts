import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { IUserInputDTO } from '../../interfaces/IUser';
import { AppLogger } from '../../app.logger';
import AuthService from '../../services/auth';
import middlewares from '../middlewares';
import checkRole from '../middlewares/checkRole';
import { celebrate, Joi } from 'celebrate';

const {
	isAuth,
	attachCurrentUser,
	getCache,
	setCache,
	clearCache,
} = middlewares;

const logger = new AppLogger('User');
const user = Router();

const path = 'USERS';

export default (app: Router): void => {
	app.use('/', user);

	/**
	 * @api {GET} api/me
	 * @description Retrieve person's profile
	 * @access Private
	 */
	user.get(
		'/me',
		isAuth,
		attachCurrentUser,
		// getCache('ME'),
		async (req: Request, res: Response, next: NextFunction) => {
			logger.debug('[me] Calling My Profile Details endpoint');
			try {
				const user = req.currentUser;
				// set me data to redis
				// setCache(`${req.currentUser._id}/ME`, user);
				return res.status(200).send({
					success: true,
					message: 'Profile details fetched successfully',
					data: user,
				});
			} catch (e) {
				logger.error('🔥 error: %o', e.stack);
				return next(e);
			}
		},
	);

	/**
	 * @api {GET} api/people/:id
	 * @description Retrieve person's details by id
	 * @access Private
	 */
	user.get(
		'/people/:id',
		isAuth,
		attachCurrentUser,
		checkRole('User'),
		async (req: Request, res: Response, next: NextFunction) => {
			logger.debug('[peopleId] Calling GetUserDetails endpoint');
			try {
				const {
					params: { id },
				} = req;
				const userService = Container.get(AuthService);
				const user = await userService.UserProfile(id);

				return res.status(200).send({
					success: true,
					message: 'User details fetched successfully',
					data: user,
				});
			} catch (e) {
				logger.error('🔥 error: %o', e.stack);
				return next(e);
			}
		},
	);

	/**
	 * @api {GET} api/people
	 * @description Retrieve all users
	 * @access Private
	 */
	user.get(
		'/people',
		isAuth,
		attachCurrentUser,
		// checkRole('Admin'),
		// getCache(path),
		async (req: Request, res: Response, next: NextFunction) => {
			logger.debug('[people] Calling FetchingAllUsers endpoint');
			try {
				const userService = Container.get(AuthService);
				const users = await userService.GetUsers();

				// set users data to redis
				// setCache(`${req.currentUser._id}/${path}`, users);

				return res.status(200).send({
					success: true,
					message: 'User fetched successfully',
					data: users,
				});
			} catch (e) {
				logger.error('🔥 error: %o', e.stack);
				return next(e);
			}
		},
	);

	/**
	 * @api {PUT} api/people/:id
	 * @description Edit person details
	 * @access Private
	 */
	user.put(
		'/people/:id',
		isAuth,
		celebrate({
			body: Joi.object({
				firstName: Joi.string(),
				lastName: Joi.string(),
				email: Joi.string(),
				photo: Joi.string(),
			}),
		}),

		async (req: Request, res: Response) => {
			try {
				logger.debug('[peopleId] Calling PatchUserDetails endpoint');
				const {
					params: { id },
				} = req;
				const userService = Container.get(AuthService);
				const user = await userService.UpdateUserDetails(id, req.body);
				return res.status(200).send({
					success: true,
					message: 'User details updated successfully',
					data: user,
				});
			} catch (e) {
				logger.error('🔥 error: %o', e.stack);
				return res
					.send({
						success: false,
						message: 'Server Error. Could not complete the request',
					})
					.status(500);
			}
		},
	);

	/**
	 * @api {PUT} api/role/:id
	 * @description Edit a role
	 * @access Private
	 */
	user.put(
		'/people/role/:id',
		isAuth,
		attachCurrentUser,
		checkRole('User'),
		clearCache(path),
		celebrate({
			body: Joi.object({
				role: Joi.string(),
				isVerified: Joi.boolean(),
			}),
		}),
		async (req: Request, res: Response) => {
			logger.debug('[peopleId] Calling PatchUserRole endpoint');
			try {
				const {
					params: { id },
				} = req;
				const userService = Container.get(AuthService);
				const user = await userService.UpdateCurrentUserRole(
					id,
					req.body as IUserInputDTO,
				);
				return res.status(200).send({
					success: true,
					message: 'User role has been updated successfully',
					data: user,
				});
			} catch (e) {
				logger.error('🔥 error: %o', e.stack);
				return res
					.send({
						success: false,
						message: 'Server Error. Could not complete the request',
					})
					.status(500);
			}
		},
	);
};
