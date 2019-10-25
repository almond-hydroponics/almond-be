import * as passport from 'passport';
import * as pGoogle from 'passport-google-oauth';
import { Container } from 'typedi';
import AuthService from '../services/auth';
import { IUser } from '../interfaces/IUser';
import config from '../config';

const GoogleStrategy = pGoogle.OAuth2Strategy;

passport.use(
  new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK,
    },
    (accessToken, refreshToken, profile, cb) => {
      try {
        const data = profile._json;
        const user = {
          id: data.sub,
          name: data.name,
          photo: data.picture,
          email: data.email,
          isVerified: data.email_verified,
        };
        // const authServerInstance = Container.get(AuthService);
        // const { user, token } = await authServerInstance.SocialLogin(userData);
        cb(null, user);
      } catch (e) {
        console.log('🔥 error ', e);
        cb(e);
      }
    },
  ),
);

passport.serializeUser((user: IUser, cb) => cb(null, user));

passport.deserializeUser(async (email: string, cb) => {
  try {
    const authServerInstance = Container.get(AuthService);
    const user = await authServerInstance.deserializeUser(email);
    cb(null, user);
  } catch (e) {
    console.log('🔥 error ', e);
    cb(e);
  }
});
