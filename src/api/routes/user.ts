import { Router, Request, Response, NextFunction } from 'express';
import middlewares from '../middlewares';
import { Container } from "typedi";

const {
  isAuth,
  attachCurrentUser,
} = middlewares;

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
    const logger = Container.get('logger');
    // @ts-ignore
    logger.debug('Calling GetUserDetails endpoint');
    try {
      return res.status(200).send({
        success: true,
        message: 'User details fetched successfully',
        data: req.currentUser
      })
    } catch (e) {
      // @ts-ignore
      logger.error('🔥 error: %o', e);
      return next(e)
    }
  });
};
