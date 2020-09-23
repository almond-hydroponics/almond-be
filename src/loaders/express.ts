import { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import passport from 'passport';
import expressSession from 'express-session';
import helmet from 'helmet';
import routes from '../api';
import { config } from '../config';
import corsOptions from '../config/cors';
import Agendash from 'agendash';
import Agenda from 'agenda';
import redisClient from './redis';
import { IError } from '../shared/IError';
import requestIp from 'request-ip';

export default ({
	app,
	agendaInstance,
}: {
	app: Application;
	agendaInstance: Agenda;
}) => {
	app.use(require('express-status-monitor')());

	// Health Check endpoints
	app.get('/status', (req, res) => {
		res.status(200).end();
	});

	app.head('/status', (req, res) => {
		res.status(200).end();
	});

	app.use('/agendash', Agendash(agendaInstance));

	// app.use(rateLimiterUsingThirdParty);

	// Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
	// It shows the real origin IP in the heroku or Cloudwatch logs
	// todo check the effects on enabling trust proxy {{ IPs can be spoofed easily }} proposed lib request-ip middleware
	app.enable('trust proxy');
	app.use(requestIp.mw());

	// The magic package that prevents frontend developers going nuts
	// Alternate description:
	// Enable Cross Origin Resource Sharing to all origins by default
	app.use(cors(corsOptions));

	// Some sauce that always add since 2014
	// "Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it."
	// Maybe not needed anymore ?
	app.use(require('method-override')());

	// Middleware that transforms the raw string of req.body into json
	app.use(bodyParser.json({ limit: '2mb' }));
	app.use(bodyParser.urlencoded({ extended: true }));

	app.use(helmet());

	const redisStore = require('connect-redis')(expressSession);

	// Configuration for cookie expressSession
	app.use(
		expressSession({
			secret: config.sessionSecret,
			resave: true,
			saveUninitialized: true,
			cookie: {
				secure: false,
				domain: config.cookiesDomain,
			},
			store: new redisStore({ client: redisClient }),
		}),
	);

	// Passport initialization
	require('../config/passport');
	app.use(passport.initialize());
	app.use(passport.session());

	app.get('/', (req, res) => {
		res.redirect(config.clientUrl);
	});

	// Load API routes
	app.use(config.api.prefix, routes());

	// Catch 404 and forward to error handler
	app.use((req, res, next) => {
		const err: IError = new Error('Not Found');
		err.status = 404;
		next(err);
	});

	/// Error handlers
	app.use((err, req, res, next) => {
		/**
		 * Handle 401 thrown by express-jwt library
		 */
		if (err.name === 'UnauthorizedError') {
			return res.status(err.status).send({ message: err.message }).end();
		}
		return next(err);
	});

	app.use((err, req, res, next) => {
		res.status(err.status || 500);
		res.json({
			errors: {
				message: err.message,
			},
		});
	});
};
