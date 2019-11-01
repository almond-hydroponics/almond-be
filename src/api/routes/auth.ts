import {NextFunction, Request, Response, Router} from 'express';
import {Container} from 'typedi';
import AuthService from '../../services/auth';
import {IUserInputDTO} from '../../interfaces/IUser';
import middlewares from '../middlewares';
import {celebrate, Joi} from 'celebrate';
import * as passport from 'passport';
import config from '../../config';

const auth = Router();

const {
  isAuth,
  checkRole,
  attachCurrentUser,
} = middlewares;


export default (app: Router) => {
  app.use('/auth', auth);

  /**
   * @api {POST} api/auth/signup
   * @description Register a new user
   * @access Public
   */
  auth.post(
    '/signup',
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger = Container.get('logger');
      // @ts-ignore
      logger.debug('Calling Sign-Up endpoint with body: %o', req.body);
      try {
        const authServiceInstance = Container.get(AuthService);
        const {user, token} = await authServiceInstance.SignUp(req.body as IUserInputDTO);
        return res.status(201).send({
          success: true,
          message: 'Account registration successful',
          data: {user, token}
        });
      } catch (e) {
        // @ts-ignore
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  /**
   * @route {POST} api/auth/signin
   * @description Login a new user
   * @access Public
   */
  auth.post(
    '/signin',
    celebrate({
      body: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger = Container.get('logger');
      // @ts-ignore
      logger.debug('Calling Sign-In endpoint with body: %o', req.body);
      try {
        const {email, password} = req.body;
        const authServiceInstance = Container.get(AuthService);
        const {user, token} = await authServiceInstance.SignIn(email, password);
        return res.json({user, token}).status(200);
      } catch (e) {
        // @ts-ignore
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  /**
   * @route {POST} api/auth/user/login-as
   * @description Login as an admin or maintenance person
   * @access Public
   */
  auth.post(
    '/user/login-as', isAuth, attachCurrentUser, checkRole('admin'),
    async (req: Request, res: Response) => {
      const logger = Container.get('logger');
      try {
        const email = req.body.user.email;
        const authServiceInstance = Container.get(AuthService);
        const {user, token} = await authServiceInstance.LoginAs(email);
        return res.status(200).json({user, token}).end();
      } catch (e) {
        // @ts-ignore
        logger.error('Error in login as user: ', e);
        return res.json(e).status(500).end();
      }
    });

  /**
   * @api {GET} api/auth/google/login
   * @description Social authentication with google
   * @access Public
   */
  auth.get(
    '/google/login',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  /**
   * @api {GET} api/auth/google/callback
   * @description Google callback redirect url
   * @access Public on request
   */
  auth.get(
    '/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/', session: false }),
    async (req: Request, res, next: NextFunction) => {
      const logger = Container.get('logger');
      try {
        const authServerInstance = Container.get(AuthService);
        // @ts-ignore
        const { user, token } = await authServerInstance.SocialLogin(req.user);
        res.cookie('jwt-token', token);
        res.redirect(`${config.clientUrl}?socialToken=${token}`);
      } catch (e) {
        // @ts-ignore
        logger.error('🔥 error: %o', e);
        return next(e);
      }
    }
  );

  /**
   * @TODO Let's leave this as a place holder for now
   * The reason for a logout route could be deleting a 'push notification token'
   * so the device stops receiving push notifications after logout.
   *
   * Another use case for advance/enterprise apps, you can store a record of the jwt token
   * emitted for the session and add it to a black list.
   * It's really annoying to develop that but if you had to, please use Redis as your data store
   */
  auth.post('/logout', middlewares.isAuth, (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get('logger');
    // @ts-ignore
    logger.debug('Calling Sign-Out endpoint with body: %o', req.body);
    try {
      //@TODO AuthService.Logout(req.user) do some clever stuff
      return res.status(200).end();
    } catch (e) {
      // @ts-ignore
      logger.error('🔥 error %o', e);
      return next(e);
    }
  });
};
