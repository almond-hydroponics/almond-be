import { config } from './index';

// const whitelist = [
//   'http://localhost:3000',
//   'http://almond.com:3000',
//   'https://almond-re-staging.herokuapp.com',
//   'https://accounts.google.com/o/oauth2/v2/',
//   'https://accounts.google.com/*',
//   'https://accounts.google.com/o/oauth2/v2/auth',
//   'http://' + config.siteUrl,
//   config.siteUrl
// ];

const whitelist = [
	'http://froyo.almond:3000',
	'https://almond-re.herokuapp.com',
	'http://' + config.siteUrl,
	config.siteUrl,
	'http://localhost:8080',
];

const corsOptions = {
	origin: function (origin, callback) {
		if (whitelist.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	credentials: true,
	preflightContinue: false,
	optionsSuccessStatus: 204,
};

export default corsOptions;
