import * as dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Your favorite port
   */
  port: parseInt(process.env.PORT, 10),

  /**
   * That long string from mlab
   */
  databaseURL: process.env.MONGODB_URI,

  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET,

  /**
   * Your session secret
   */
  sessionSecret: process.env.SESSION_SECRET,

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },

  /**
   * Agenda.js stuff
   */
  agenda: {
    dbCollection: process.env.AGENDA_DB_COLLECTION,
    pooltime: process.env.AGENDA_POOL_TIME,
    concurrency: parseInt(process.env.AGENDA_CONCURRENCY, 10),
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },

  /**
   * Agendash config
   */
  agendash: {
    user: process.env.AGENDA_USER,
    password: process.env.AGENDA_PASSWORD,
  },

  /**
   * Mailgun email credentials
   */
  emails: {
    apiKey: 'API key from mailgun when we will actually need this',
    domain: 'Domain Name from mailgun'
  },

  /**
   * Public url
   */
  clientUrl: process.env.PUBLIC_URL,
};
