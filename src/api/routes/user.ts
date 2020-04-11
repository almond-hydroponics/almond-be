import { celebrate, Joi } from 'celebrate';
import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { IUserInputDTO } from '../../interfaces/IUser';
import { AppLogger } from '../../loaders/logger';
import AuthService from '../../services/auth';
import middlewares from '../middlewares';
import checkRole from '../middlewares/checkRole';

const {
  isAuth,
  attachCurrentUser,
} = middlewares;

const logger = new AppLogger('User');
const user = Router();

export default (app: Router) => {
  app.use('/', user);

  /**
   * @api {GET} api/me
   * @description Get my personal details
   * @access Private
   */
  user.get('/me', isAuth, attachCurrentUser,
    async (req: Request, res: Response, next: NextFunction) => {
    logger.debug('Calling GetUserDetails endpoint');
    try {
      return res.status(200).send({
        success: true,
        message: 'User details fetched successfully',
        data: req.currentUser
      })
    } catch (e) {
      logger.error('🔥 error: %o', e.stack);
      return next(e)
    }
  });
};
