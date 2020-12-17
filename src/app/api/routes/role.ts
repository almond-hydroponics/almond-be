import { Router, Request, Response, NextFunction } from 'express';
import { celebrate, Joi } from 'celebrate';
import { Container } from 'typedi';
import { IRoleInputDTO } from '../../interfaces/IRole';
import { AppLogger } from '../../app.logger';
import PermissionService from '../../services/permissions';
import ResourceService from '../../services/resource';
import RoleService from '../../services/role';
import middlewares from '../middlewares';

const logger = new AppLogger('Schedule');
const {
	isAuth,
	checkRole,
	attachCurrentUser,
	getCache,
	setCache,
	clearCache,
} = middlewares;
const role = Router();

const path = 'ROLE';

export default (app: Router): void => {
	app.use('/', role);

	/**
	 * @api {POST} api/role
	 * @description Create a new role
	 * @access Private
	 */
	role.post(
		'/roles',
		isAuth,
		attachCurrentUser,
		checkRole('User'),
		clearCache(path),

		celebrate({
			body: Joi.object({
				title: Joi.string().required(),
				description: Joi.string().required(),
				resourceAccessLevels: Joi.array(),
			}),
		}),
		async (req: Request, res: Response) => {
			logger.debug(
				`Calling Role endpoint with body: ${JSON.stringify(req.body)}`,
			);
			try {
				const roleServiceInstance = Container.get(RoleService);
				const { role } = await roleServiceInstance.CreateRole(
					req.body as IRoleInputDTO,
				);

				return res.status(201).send({
					success: true,
					message: 'Role added successfully',
					data: role,
				});
			} catch (e) {
				logger.error('🔥 error: %o', e.stack);
				const serverError = 'Server Error. Could not complete the request';
				return res.json({ serverError }).status(500);
			}
		},
	);

	/**
	 * @api {GET} api/role
	 * @description Get all roles
	 * @access Private
	 */
	role.get(
		'/roles',
		isAuth,
		attachCurrentUser,
		checkRole('Admin'),
		getCache(path),

		async (req: Request, res: Response, next: NextFunction) => {
			logger.debug('Calling GetAllRoles endpoint');
			try {
				const roleServiceInstance = Container.get(RoleService);
				const resourceServiceInstance = Container.get(ResourceService);
				const permissionServiceInstance = Container.get(PermissionService);

				const roles = await roleServiceInstance.GetRoles();
				const resources = await resourceServiceInstance.GetResources();
				const permissions = await permissionServiceInstance.GetPermission();

				if (roles.length !== null) {
					return res.status(200).send({
						permissions,
						resources,
						success: true,
						message: 'User roles fetched successfully',
						data: roles,
					});
				}

				// set roles data to redis
				setCache(`${req.currentUser._id}/${path}`, role);

				return res.status(202).send({
					success: false,
					message: 'You have not created any roles.',
					data: [],
				});
			} catch (e) {
				logger.error('🔥 error: %o', e.stack);
				return next(e);
			}
		},
	);

	/**
	 * @api {PATCH} api/role/:id
	 * @description Edit a role
	 * @access Private
	 */
	role.patch(
		'/role/:id',
		isAuth,
		attachCurrentUser,
		checkRole('Admin'),
		clearCache(path),

		celebrate({
			body: Joi.object({
				role: Joi.string(),
				roleId: Joi.string().required(),
			}),
		}),
		async (req: Request, res: Response) => {
			logger.debug(
				`Calling PatchRole endpoint with body: ${JSON.stringify(req.body)}`,
			);
			try {
				const {
					params: { id },
				} = req;
				const roleServiceInstance = Container.get(RoleService);
				const { role } = await roleServiceInstance.EditRole(
					id,
					req.body as IRoleInputDTO,
				);
				if (role) {
					return res.status(200).send({
						success: true,
						message: 'User role has been updated successfully',
						data: role,
					});
				}
				return res.status(404).send({
					success: false,
					message: 'User role does not exist',
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
	 * @api {DELETE} api/role/:id
	 * @description Delete a role by id
	 * @access Private
	 */
	role.delete(
		'/roles/:id',
		isAuth,
		attachCurrentUser,
		checkRole('Admin'),
		clearCache(path),

		async (req: Request, res: Response, next: NextFunction) => {
			logger.debug('Calling DeleteRoleById endpoint');
			try {
				const {
					params: { id },
				} = req;
				const roleServiceInstance = Container.get(RoleService);
				const role = await roleServiceInstance.DeleteRoleById(id);
				if (role.n > 0) {
					const message = 'User role has been deleted successfully';
					return res.status(200).json({ message });
				}
				const error = 'Role does not exist';
				return res.status(404).json({ error });
			} catch (e) {
				logger.error('🔥 error: %o', e.stack);
				const serverError = 'Server Error. Could not complete the request';
				return res.json({ serverError }).status(500);
			}
		},
	);
};
