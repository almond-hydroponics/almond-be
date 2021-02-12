import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error && process.env.NODE_ENV === 'production')
	throw new Error("⚠️  Couldn't find .env file  ⚠️");

interface Config {
	isProduction: boolean;
	port: number | null | undefined;
	host: string;
	databaseURL: string;
	mongo: {
		username: string;
		password: string;
		hostname: string;
		port: number;
		database: string;
	};
	redisURL: string;
	siteUrl: string;
	redirectUrl: string;
	serverUrl: string;
	clientUrl: string;
	jwtSecret: string;
	jwtAlgorithm: string;
	sessionSecret: string;
	cookiesDomain: string;
	nodeMailer: {
		username: string;
		password: string;
		host: string;
		port: number;
	};
	logs: {
		level: string;
	};
	agenda: {
		dbCollection: string;
		pooltime: string | null | undefined;
		concurrency: number | null | undefined;
	};
	api: {
		prefix: string;
	};
	agendash: {
		user: string;
		password: string;
	};
	emails: {
		apiKey: string;
		domain: string;
	};
	google: {
		clientID: string;
		clientSecret: string;
		callbackUrl: string;
		refreshToken: string;
		accessToken: string;
		mailClientId: string;
		mailClientSecret: string;
		mailRefreshToken: string;
	};
	mail: {
		from: string;
	};
	saltRounds: string;
	mqtt: {
		user: string;
		password: string;
		host: string;
		port: string;
		protocol: string;
		server: string;
		scheduleTopic: string;
	};
	firebase: {
		type: string;
		project_id: string;
		private_key_id: string;
		private_key: string;
		client_email: string;
		client_id: string;
		auth_uri: string;
		token_uri: string;
		auth_provider_x509_cert_url: string;
		client_x509_cert_url: string;
	};
	almond_admin: string;
	assetsPath: string;
	uuid: string;
	session: {
		domain: string;
		secret: string;
		timeout: number;
		refresh: {
			secret: string;
			timeout: number;
		};
		verify_account: {
			secret: string;
			timeout: number;
		};
		password_reset: {
			secret: string;
			timeout: number;
		};
		verify: {
			secret: string;
			timeout: number;
		};
	};
}

export const config: Config = {
	isProduction: process.env.NODE_ENV === 'production',
	port: +process.env.PORT,
	host: process.env.APP_HOST,
	databaseURL: process.env.MONGODB_URI,
	mongo: {
		username: process.env.MONGO_USERNAME,
		password: process.env.MONGO_PASSWORD,
		hostname: process.env.MONGO_HOSTNAME,
		port: parseInt(process.env.MONGO_PORT, 10),
		database: process.env.MONGO_DATABASE,
	},
	redisURL: process.env.REDIS_URL || 'no-redis',
	siteUrl:
		process.env.NODE_ENV === 'development'
			? process.env.DEVELOPMENT_SITE_URL
			: process.env.PRODUCTION_SITE_URL,
	serverUrl:
		process.env.NODE_ENV === 'development'
			? process.env.DEVELOPMENT_SERVER_URL
			: process.env.PRODUCTION_SERVER_URL,
	redirectUrl:
		process.env.NODE_ENV === 'development'
			? process.env.DEVELOPMENT_REDIRECT_URL
			: process.env.PRODUCTION_REDIRECT_URL,
	jwtSecret: process.env.JWT_SECRET,
	jwtAlgorithm: process.env.JWT_ALGORITHM,
	sessionSecret: process.env.SESSION_SECRET,
	cookiesDomain:
		process.env.NODE_ENV === 'development'
			? 'froyo.almond.com'
			: process.env.COOKIES_DOMAIN,
	nodeMailer: {
		username: process.env.NODEMAILER_USERNAME,
		password: process.env.NODEMAILER_PASSWORD,
		port: parseInt(process.env.NODEMAILER_PORT, 10),
		host: process.env.NODEMAILER_HOST,
	},
	logs: {
		level: process.env.LOG_LEVEL || 'silly',
	},
	agenda: {
		dbCollection: process.env.AGENDA_DB_COLLECTION,
		pooltime: process.env.AGENDA_POOL_TIME,
		concurrency: parseInt(process.env.AGENDA_CONCURRENCY, 10),
	},
	api: {
		prefix: '/api',
	},
	agendash: {
		user: process.env.AGENDA_USER,
		password: process.env.AGENDA_PASSWORD,
	},
	emails: {
		apiKey: 'API key from mailgun when we will actually need this',
		domain: 'Domain Name from mailgun',
	},

	clientUrl: process.env.PUBLIC_URL,

	google: {
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackUrl: process.env.GOOGLE_CALLBACK_URL,
		refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
		accessToken: process.env.GOOGLE_ACCESS_TOKEN,
		mailClientId: process.env.GOOGLE_CLIENT_ID,
		mailClientSecret: process.env.GOOGLE_CLIENT_SECRET,
		mailRefreshToken: process.env.GOOGLE_MAIL_REFRESH_TOKEN,
	},

	mail: {
		from: process.env.MAIL_FROM,
	},

	saltRounds: process.env.SALT_ROUNDS,

	mqtt: {
		user: process.env.MQTT_USER,
		password: process.env.MQTT_PASSWORD,
		host: process.env.MQTT_HOST,
		port: process.env.MQTT_PORT,
		protocol: process.env.MQTT_PROTOCOL,
		server: process.env.MQTT_SERVER,
		scheduleTopic: process.env.MQTT_PUMP_SCHEDULE,
	},

	firebase: {
		type: process.env.FIREBASE_TYPE,
		project_id: process.env.FIREBASE_PROJECT_ID,
		private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
		private_key: process.env.FIREBASE_PRIVATE_KEY,
		client_email: process.env.FIREBASE_CLIENT_EMAIL,
		client_id: process.env.FIREBASE_CLIENT_ID,
		auth_uri: process.env.FIREBASE_AUTH_URI,
		token_uri: process.env.FIREBASE_TOKEN_URI,
		auth_provider_x509_cert_url:
			process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
		client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
	},
	almond_admin: process.env.ALMOND_ADMIN,
	assetsPath: `${__dirname}/../assets`,
	uuid: process.env.UUID,
	session: {
		domain: process.env.SESSION_DOMAIN,
		secret: process.env.SESSION_SECRET,
		timeout: parseInt(process.env.SESSION_TIMEOUT, 10),
		refresh: {
			secret: process.env.SESSION_REFRESH_SECRET,
			timeout: parseInt(process.env.SESSION_REFRESH_TIMEOUT, 10),
		},
		verify_account: {
			secret: process.env.SESSION_VERIFY_ACCOUNT,
			timeout: parseInt(process.env.SESSION_VERIFY_ACCOUNT_TIMEOUT, 10),
		},
		password_reset: {
			secret: process.env.SESSION_PASSWORD_RESET_SECRET,
			timeout: parseInt(process.env.SESSION_PASSWORD_RESET_TIMEOUT, 10),
		},
		verify: {
			secret: process.env.SESSION_VERIFY_SECRET,
			timeout: parseInt(process.env.SESSION_VERIFY_TIMEOUT, 10),
		},
	},
};
