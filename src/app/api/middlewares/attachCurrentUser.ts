import { Container } from 'typedi';
import { AppLogger } from '../../app.logger';
import AuthService from '../../services/auth';
import { NextFunction, Request, Response } from 'express';

const logger = new AppLogger('CurrentUser');

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
	try {
		const userService = Container.get(AuthService);
		req.currentUser = await userService.UserProfile(req.token.id);
		return next();
	} catch (e) {
		logger.error('🔥 Error attaching user to req: %o', e.stack);
		return next(e);
	}
};

export default attachCurrentUser;
