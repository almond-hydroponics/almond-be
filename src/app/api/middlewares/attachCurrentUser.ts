import { Container } from 'typedi';
import AuthService from '../../services/auth';
import { NextFunction, Request, Response } from 'express';
import { Logger } from 'winston';

/**
 * Attach user to req.user
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
const attachCurrentUser = async (
	req: Request | any,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	const logger: Logger = Container.get('logger');
	try {
		const userService = Container.get(AuthService);
		const currentUser = await userService.UserProfile(req.token.id);
		req.currentUser = currentUser;
		return next();
	} catch (e) {
		logger.error('🔥 Error attaching user to req: %o', e.message);
		return next(e);
	}
};

export default attachCurrentUser;
