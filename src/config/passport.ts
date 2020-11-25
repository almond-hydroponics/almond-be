import passport from 'passport';
import pGoogle from 'passport-google-oauth2';
import { Container } from 'typedi';
import { IUser } from '../interfaces/IUser';
import { AppLogger } from '../loaders/logger';
import AuthService from '../services/auth';
import { config } from './index';

const logger = new AppLogger('Auth');
const GoogleStrategy = pGoogle.Strategy;

passport.use(
	new GoogleStrategy(
		{
			clientID: config.google.clientID,
			clientSecret: config.google.clientSecret,
			callbackURL: config.google.callbackUrl,
			passReqToCallback: true,
		},
		async (request, accessToken, refreshToken, profile, done) => {
			try {
				const authServerInstance = Container.get(AuthService);
				const user = await authServerInstance.SocialLogin(profile);

				if (typeof user === 'string') {
					return request.res.redirect(
						`${config.siteUrl}/link/google/${user}/${profile.email}`,
					);
				}

				done(null, user);
			} catch (e) {
				logger.error('🔥 Passport Google error: ', e.stack);
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
		logger.error('🔥 Passport deserializerUser error: ', e.stack);
		done(e);
	}
});
