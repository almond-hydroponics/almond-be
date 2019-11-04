import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';
import * as cookieSession from 'cookie-session';
import * as session from 'express-session';
import * as helmet from 'helmet';
import * as cron from 'node-cron';
import routes from '../api';
import config from '../config';

const allowedOrigins = [
  'http://localhost:3000',
  'http://almond.com:3000',
  'https://almond-re-staging.herokuapp.com',
  'https://accounts.google.com/o/oauth2/v2/',
  'https://accounts.google.com/*',
  'https://accounts.google.com/o/oauth2/v2/auth',
  '*',
];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
};

const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // one day

export default ({ app }: { app: express.Application }) => {
  // Health Check endpoints
  app.get('/status', (req, res) => {
    res.status(200).end();
  });

  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');

  // Configuration for cookie session
  app.use(cookieParser());
  app.use(session({
    secret: config.sessionSecret,
    resave: true,
    saveUninitialized: true
  }));

  cron.schedule('09 19 * * *', () => {
    console.log('Class: , Function: , Line 56 masha():', 'masha');
  });

  // app.use(cookieSession({
  //   name: 'session',
  //   keys: [config.jwtSecret],
  //   maxAge: 24 * 60 * 60 * 1000,
  //   cookie: {
  //     secure: false,
  //     httpOnly: true,
  //     domain: 'almond.com:3000',
  //     path: '/',
  //     expires: expiryDate
  //   }
  // }));

  // The magic package that prevents frontend developers going nuts
  // Alternate description:
  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors(options));

  // Some sauce that always add since 2014
  // "Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it."
  // Maybe not needed anymore ?
  app.use(require('method-override')());

  app.use(helmet());

  // Middleware that transforms the raw string of req.body into json
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));


  // Passport initialization
  require('../config/passport');
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/', (req, res) => {
    res.redirect(config.clientUrl);
  });

  // Load API routes
  app.use(config.api.prefix, routes());

  // Enable pre-flight
  app.options("*", cors(options));

  // Catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err['status'] = 404;
    next(err);
  });

  /// Error handlers
  app.use((err, req, res, next) => {
    /**
     * Handle 401 thrown by express-jwt library
     */
    if (err.name === 'UnauthorizedError') {
      return res
        .status(err.status)
        .send({ message: err.message })
        .end();
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
