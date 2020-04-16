import { Container } from 'typedi';
import { AppLogger } from '../../loaders/logger';
import AuthService from '../../services/auth';

const logger = new AppLogger('CurrentUser');

/**
 * Attach user to req.user
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
const attachCurrentUser = async (req, res, next) => {
  try {
    const userService = Container.get(AuthService);
    req.currentUser = await userService.UserProfile(req.token.userData._id);
    return next();
  } catch (e) {
    logger.error('🔥 Error attaching user to req: %o', e.stack);
    return next(e);
  }
};

export default attachCurrentUser;
