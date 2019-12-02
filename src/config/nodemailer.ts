import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';
import config from '.';

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  config.googleMailClientId,
  config.googleMailClientSecret,
  'https://developers.google.com/oauthplayground',
);

oauth2Client.setCredentials({
  refresh_token: config.googleMailRefreshToken,
});

const accessToken = oauth2Client.getAccessToken();

const smtpTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'almond.froyo@gmail.com',
    clientId: config.googleMailClientId,
    clientSecret: config.googleMailClientSecret,
    refreshToken: config.googleMailRefreshToken,
    accessToken: accessToken,
  },
} as any);

export default smtpTransport;
