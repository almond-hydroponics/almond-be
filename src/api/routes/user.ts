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
  getCache,
  setCache,
  clearCache
} = middlewares;

const logger = new AppLogger('User');
const user = Router();

const path = 'USERS';

export default (app: Router) => {
  app.use('/', user);
  /**
   * @api {GET} api/me
   * @description Get my personal details
   * @access Private
   */
  user.get('/me',
    isAuth,
    attachCurrentUser,
    // getCache('ME'),
    async (req: Request, res: Response, next: NextFunction) => {
    logger.debug('Calling My Profile Details endpoint');
    try {
      const user = req.currentUser;
      // set me data to redis
      // setCache(`${req.currentUser._id}/ME`, user);
      return res.status(200).send({
        success: true,
        message: 'Profile details fetched successfully',
        data: user
      })
    } catch (e) {
      logger.error('🔥 error: %o', e.stack);
      return next(e)
    }
  });

  user.get('/people/:id', isAuth, attachCurrentUser, checkRole('User'),
    async (req: Request, res: Response, next: NextFunction) => {
      logger.debug('Calling GetUserDetails endpoint');
      try {
        const { params: { id } } = req;
        const userService = Container.get(AuthService);
        const user = await userService.UserProfile(id);

        return res.status(200).send({
          success: true,
          message: 'User details fetched successfully',
          data: user
        })
      } catch (e) {
       logger.error('🔥 error: %o', e.stack);
       return next(e)
      }
    });

  user.get('/people',
    isAuth,
    attachCurrentUser,
    checkRole('Admin'),
    getCache(path),
     async (req: Request, res: Response, next: NextFunction) => {
       logger.debug('Calling FetchingAllUsers endpoint');
       try {
         const userService = Container.get(AuthService);
         const users = await userService.GetUsers();

         // set users data to redis
         setCache(`${req.currentUser._id}/${path}`, users);

         return res.status(200).send({
           success: true,
           message: 'User fetched successfully',
           data: users
         })
       } catch (e) {
         logger.error('🔥 error: %o', e.stack);
         return next(e)
       }
     });

  /**
   * @api {PATCH} api/role/:id
   * @description Edit a role
   * @access Private
   */
  user.patch('/people/:id',
    isAuth,
    attachCurrentUser,
    checkRole('User'),
    clearCache(path),
    // celebrate({
    //   body: Joi.object({
    //     userDetails: Joi.string(),
    //     roleId: Joi.string().required(),
    //   }),
    // }),
    async (req: Request, res: Response) => {
     logger.debug(`Calling PatchUserDetails endpoint with body: ${JSON.stringify(req.body)}`);
     try {
       const { params: { id } } = req;
       const userService = Container.get(AuthService);
       const user = await userService.UpdateCurrentUserRole(id, req.body as IUserInputDTO);
       logger.debug(JSON.stringify(user.currentRole));
       return res.status(200).send({
         success: true,
         message: 'User role has been updated successfully',
         data: user,
       });
     } catch (e) {
       logger.error('🔥 error: %o', e.stack);
       return res.send({
         success: false,
         message: 'Server Error. Could not complete the request',
       }).status(500)
     }
    }
  );
};
