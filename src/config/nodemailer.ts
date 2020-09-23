import { createTransport, SendMailOptions, SentMessageInfo } from 'nodemailer';
import { google } from 'googleapis';
import { config } from './index';
import { TwingEnvironment, TwingLoaderFilesystem } from 'twing';

export async function mail(options: SendMailOptions): Promise<SentMessageInfo> {
	const { OAuth2 } = google.auth;

	const oauth2Client = new OAuth2(
		config.google.mailClientId,
		config.google.mailClientSecret,
		'https://developers.google.com/oauthplayground',
	);

	oauth2Client.setCredentials({
		refresh_token: config.google.mailRefreshToken,
	});

	const accessToken = oauth2Client.getAccessToken();

	const transporter = createTransport({
		service: 'gmail',
		auth: {
			accessToken,
			type: 'OAuth2',
			user: 'almond.froyo@gmail.com',
			clientId: config.google.mailClientId,
			clientSecret: config.google.mailClientSecret,
			refreshToken: config.google.mailRefreshToken,
		},
	} as any);

	return transporter.sendMail({ ...options, from: config.mail.from });
}

export const renderTemplate = (path: string, data: any): string => {
	const loader = new TwingLoaderFilesystem(config.assetsPath);
	const twing = new TwingEnvironment(loader);
	return twing.render(path, data);
};
