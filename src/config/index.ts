import * as dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  port: parseInt(process.env.PORT, 10),

  databaseURL: process.env.MONGODB_URI,

  redisURL: process.env.REDIS_URL,

  siteUrl: process.env.NODE_ENV === 'development' ? process.env.DEVELOPMENT_SITE_URL : process.env.PRODUCTION_SITE_URL,

  serverUrl:
    process.env.NODE_ENV === 'development' ? process.env.DEVELOPMENT_SERVER_URL : process.env.PRODUCTION_SERVER_URL,

  jwtSecret: process.env.JWT_SECRET,

  sessionSecret: process.env.SESSION_SECRET,

  cookiesDomain: process.env.NODE_ENV === 'development' ? 'almond.com' : process.env.COOKIES_DOMAIN,

  nodeMailer: {
    username: process.env.NODEMAILER_USERNAME,
    password: process.env.NODEMAILER_PASSWORD,
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
    domain: 'Domain Name from mailgun'
  },

  clientUrl: process.env.PUBLIC_URL,

  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,
  googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  googleAccessToken: process.env.GOOGLE_ACCESS_TOKEN,

  googleMailClientId: process.env.GOOGLE_MAIL_CLIENT_ID,
  googleMailClientSecret: process.env.GOOGLE_MAIL_CLIENT_SECRET,
  googleMailRefreshToken: process.env.GOOGLE_MAIL_REFRESH_TOKEN,

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
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  },
};
