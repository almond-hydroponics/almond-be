import { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import passport from 'passport';
import expressSession from 'express-session';
import helmet from 'helmet';
import csrf from 'csurf';
import requestIp from 'request-ip';
import swaggerUi from 'swagger-ui-express';
import expressStatusMonitor from 'express-status-monitor';
import expressRateLimit from 'express-rate-limit';
import methodOverride from 'method-override';
import connectRedis from 'connect-redis';
import Agendash from 'agendash';
import Agenda from 'agenda';

import routes from '../api';
import { config } from '../../config';
import corsOptions from '../../config/cors';
import redisClient from './redis';
import { IError } from '../shared/IError';

import * as swaggerDocument from '../api/docs/swagger.json';
import statusMonitor from '../../config/statusMonitor';

const { isProduction, clientUrl, api } = config;

const rateLimiter = expressRateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
});

export default ({
	app,
	agendaInstance,
}: {
	app: Application;
	agendaInstance: Agenda;
}): void => {
	app.use(expressStatusMonitor(statusMonitor));
	app.get('/status', (req, res) => res.status(200).end());
	app.head('/status', (req, res) => res.status(200).end());
	app.use('/agenda-dash', Agendash(agendaInstance));
	app.use(rateLimiter);
	// TODO: check the effects on enabling trust proxy {{ IPs can be spoofed easily }} proposed lib request-ip middleware
	app.enable('trust proxy');
	app.use(requestIp.mw());
	app.use(cors(corsOptions));
	app.use(methodOverride());
	app.use(bodyParser.json({ limit: '2mb' }));
	app.use(bodyParser.urlencoded({ extended: true }));
	isProduction && app.use(helmet());
	const redisStore = connectRedis(expressSession);
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
	require('../../config/passport');
	app.use(passport.initialize());
	app.use(passport.session());
	// app.use(csrf({ cookie: true }));

	// Swagger documentation
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

	app.get('/', (req, res) => {
		res.redirect(clientUrl);
	});

	// Load API routes
	app.use(api.prefix, routes());

	// Catch 404 and forward to error handler
	app.use((req, res, next) => {
		const err: IError = new Error('Not Found');
		err.status = 404;
		next(err);
	});

	// Error handlers
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
