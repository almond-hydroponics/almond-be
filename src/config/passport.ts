import passport from 'passport';
import argon2 from 'argon2';
import { Strategy as LocalStrategy } from 'passport-local';
import {
	Strategy as GoogleStrategy,
	VerifyCallback,
} from 'passport-google-oauth2';
import { Container } from 'typedi';
import { IUser } from '../app/interfaces/IUser';
import { AppLogger } from '../app';
import AuthService from '../app/services/auth';
import { config } from './index';
import { Request } from 'express';
import { createAuthToken } from '../app/services/jwt';

const logger = new AppLogger('Auth');

passport.use(
	new GoogleStrategy(
		{
			clientID: config.google.clientID,
			clientSecret: config.google.clientSecret,
			callbackURL: config.google.callbackUrl,
			passReqToCallback: true,
		},
		async (
			request: Request,
			accessToken: string,
			refreshToken: string,
			profile,
			done: VerifyCallback,
		) => {
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

passport.use(
	new LocalStrategy(
		{ usernameField: 'email', passwordField: 'password' },
		async (email: string, password: string, done: VerifyCallback) => {
			try {
				const authServerInstance = Container.get(AuthService);
				const user = await authServerInstance.SignIn(email, password);
				done(null, user);
			} catch (e) {
				logger.error('🔥 Passport Local error: ', e.stack);
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
