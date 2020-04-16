import { AppLogger } from '../../loaders/logger';

const logger = new AppLogger('Schedule');

const checkRole = (requiredRole) => {
  return (req, res, next) => {
    const role = req.currentUser.roles.some(role => role.title === requiredRole);

    if(!role) {
      return res.status(401).send({
        success: false,
        message: 'You are not authorized to perform this action.',
      }).end();
    } else {
      logger.debug('User met the required role, going to next middleware');
      return next();
    }
  }
};

export default checkRole;
