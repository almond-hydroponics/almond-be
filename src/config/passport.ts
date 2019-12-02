import * as passport from 'passport';
import * as pGoogle from 'passport-google-oauth2';
import { Container } from 'typedi';
import config from '.';
import { IUser } from '../interfaces/IUser';
import Logger from '../loaders/logger';
import AuthService from '../services/auth';

const GoogleStrategy = pGoogle.Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: config.googleClientID,
      clientSecret: config.googleClientSecret,
      callbackURL: config.googleCallbackUrl,
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        const authServerInstance = Container.get(AuthService);
        const user = await authServerInstance.SocialLogin(profile);

        done(null, user);
      } catch (e) {
        Logger.error('🔥 Passport Google error: ', e);
        done(e);
      }
    },
  ),
);

passport.serializeUser((user: IUser, done) => done(null, user.email));

passport.deserializeUser(async (email: string, done) => {
  try {
    const authServerInstance = Container.get(AuthService);
    const user = await authServerInstance.deserializeUser(email);
    done(null, user);
  } catch (e) {
    Logger.error('🔥 Passport deserializerUser error: ', e);
    done(e);
  }
});
