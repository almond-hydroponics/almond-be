import { Application, NextFunction, Request, Response } from 'express';
import express from 'express';
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
import morgan from 'morgan';
import { AppLogger } from '../app.logger';

import routes from '../api';
import { config } from '../../config';
import corsOptions from '../../config/cors';
import redisClient from './redis';
import { IError } from '../shared/IError';

import * as swaggerDocument from '../api/docs/swagger.json';
import statusMonitor from '../../config/statusMonitor';
import { errorHandler } from '../utils/errorHandler';

const { isProduction, clientUrl, api } = config;
const logger = new AppLogger('Express');

const rateLimiter = expressRateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
});

export default ({
	app,
	agendaInstance,
}: {
	app: Application;
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
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
	// app.use(morgan('dev'));
	// app.use(morgan('combined', { stream: winston.stream }));
	app.use(methodOverride());
	// parse application/json
	app.use(express.json({ limit: '2mb' }));
	// parse application/x-www-form-urlencoded
	app.use(express.urlencoded({ limit: '50mb', extended: true }));
	isProduction && app.use(helmet());
	const redisStore = connectRedis(expressSession);
	app.use(
		expressSession({
			secret: config.sessionSecret,
			resave: false,
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

	// app.use(
	// 	async (err: Error, req: Request, res: Response, next: NextFunction) => {
	// 		if (!errorHandler.isTrustedError(err)) {
	// 			next(err);
	// 		}
	// 		await errorHandler.handleError(err);
	// 	},
	// );

	// Catch 404 and forward to error handler
	app.use((req: Request, res: Response, next: NextFunction) => {
		const err = new Error('Not Found');
		err['status'] = 404;
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
		// winston.error('', winston.combinedFormat(err, req, res));
		res.status(err.status || 500);
		res.json({
			errors: {
				message: err.message,
			},
		});
	});
};
