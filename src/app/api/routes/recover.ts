import { Router, Request, Response, NextFunction } from 'express';
import { celebrate, Joi } from 'celebrate';
import { AppLogger } from '../../app.logger';
import { Container } from 'typedi';
import RecoverService from '../../services/recover';
import MailerService from '../../services/mailer';
import HttpResponse from '../../utils/httpResponse';

const logger = new AppLogger('RecoverPassword');
const recover = Router();

export default (app: Router): void => {
	app.use('/recover', recover);

	recover.post(
		'/password',
		celebrate({
			body: Joi.object({
				email: Joi.string().email().required(),
			}),
		}),
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const mailerInstance = Container.get(MailerService);
				const mailStatus = await mailerInstance.SendRecoveryPasswordEmail(
					req.body.email,
				);

				if (!mailStatus) {
					HttpResponse.sendResponse(
						res,
						500,
						false,
						'Error while sending email. Try again.',
					);
				} else if (mailStatus.google) {
					HttpResponse.sendResponse(
						res,
						400,
						false,
						'Google accounts can not restore password.',
					);
				} else {
					HttpResponse.sendResponse(
						res,
						200,
						true,
						'Email sent successfully sent.',
					);
				}
			} catch (e) {
				logger.error('🔥 error: %o', e.message);
				return next(e);
			}
		},
	);

	recover.post(
		'/password_token_confirmation',
		celebrate({
			body: Joi.object({
				token: Joi.string().required(),
			}),
		}),
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const recoverServiceInstance = Container.get(RecoverService);
				const response = await recoverServiceInstance.ConfirmResetPasswordToken(
					req.body.token,
				);

				if (!response) {
					HttpResponse.sendResponse(
						res,
						400,
						false,
						'Invalid token. Kindly try again.',
					);
				} else {
					HttpResponse.sendResponse(
						res,
						200,
						true,
						'Password token was confirmed successful.',
					);
				}
			} catch (e) {
				logger.error('🔥 error: %o', e.message);
				return next(e);
			}
		},
	);

	recover.post(
		'/change_password',
		celebrate({
			body: Joi.object({
				token: Joi.string().required(),
				password: Joi.string().min(6).required(),
			}),
		}),
		async (req: Request, res: Response, next: NextFunction) => {
			logger.debug('[changePassword] Calling change password endpoint');
			try {
				const { token, password } = req.body;
				const recoverServiceInstance = Container.get(RecoverService);
				const { userEmail } = await recoverServiceInstance.ChangePassword(
					token,
					password,
				);

				const mailerInstance = Container.get(MailerService);
				await mailerInstance.SendPasswordResetConfirmation(userEmail);

				HttpResponse.sendResponse(
					res,
					200,
					true,
					'Password reset was successful. Kindly login with new password.',
				);
			} catch (e) {
				logger.error('🔥 error: %o', e.message);
				return next(e);
			}
		},
	);
};
