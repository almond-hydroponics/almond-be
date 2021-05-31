import { AppLogger } from '../../app.logger';
import { NextFunction, Request, Response } from 'express';

const logger = new AppLogger('Check Role');

const checkRole =
	(requiredRole: string) =>
	(req: Request, res: Response, next: NextFunction) => {
		const role = req.currentUser.roles.some(
			(role) => role.title === requiredRole,
		);

		if (!role) {
			return res
				.status(401)
				.send({
					success: false,
					message: 'You are not authorized to perform this action.',
				})
				.end();
		}
		logger.debug(
			'[checkRole] User met the required role, going to next middleware',
		);
		return next();
	};

export default checkRole;
