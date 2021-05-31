import { createTransport, SendMailOptions, SentMessageInfo } from 'nodemailer';
import { google } from 'googleapis';
import { config } from './index';
import { TwingEnvironment, TwingLoaderFilesystem } from 'twing';

const {
	google: { mailClientId, mailClientSecret, mailRefreshToken },
	assetsPath,
	mail: { from },
	isProduction,
	nodeMailer: { username, host, password, port },
} = config;

export async function mail(
	options: SendMailOptions,
): Promise<SentMessageInfo> {
	const { OAuth2 } = google.auth;

	const oauth2Client = new OAuth2(
		mailClientId,
		mailClientSecret,
		'https://developers.google.com/oauthplayground',
	);

	oauth2Client.setCredentials({
		refresh_token: mailRefreshToken,
	});

	const accessToken = oauth2Client.getAccessToken();

	let transporter = createTransport({
		host,
		port,
		auth: {
			user: username,
			pass: password,
		},
	});

	if (isProduction) {
		transporter = createTransport({
			service: 'gmail',
			auth: {
				accessToken,
				type: 'OAuth2',
				user: 'almond.froyo@gmail.com',
				clientId: mailClientId,
				clientSecret: mailClientSecret,
				refreshToken: mailRefreshToken,
			},
			tls: {
				rejectUnauthorized: false,
			},
		} as any);
	}

	return transporter.sendMail({ ...options, from });
}

export const renderTemplate = async (
	path: string,
	data: unknown,
): Promise<string> => {
	const loader = new TwingLoaderFilesystem(assetsPath);
	const twing = new TwingEnvironment(loader);
	return twing.render(path, data);
};
