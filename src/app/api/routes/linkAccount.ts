import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import { AppLogger } from '../../app.logger';
import LinkAccountService from '../../services/linkAccount';

const logger = new AppLogger('LinkAccount');
const route = Router();

export default (app: Router) => {
	app.use('/link_account', route);

	route.post(
		'/confirm_token_google',
		celebrate({
			body: Joi.object({
				token: Joi.string().required(),
			}),
		}),
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				const linkAccountServiceInstance = Container.get(LinkAccountService);
				const response = await linkAccountServiceInstance.ConfirmGoogleToken(
					req.body.token,
				);

				if (!response) {
					res.status(404).json('Invalid token');
				} else {
					res.status(200).json('');
				}
			} catch (e) {
				logger.error('🔥 error: %o', e);
				return next(e);
			}
		},
	);

	route.post(
		'/google',
		celebrate({
			body: Joi.object({
				token: Joi.string().required(),
				email: Joi.string().email().required(),
			}),
		}),
		async (req: Request, res: Response, next: NextFunction) => {
			try {
				// const linkAccountServiceInstance = Container.get(LinkAccountService);
				// const response = await linkAccountServiceInstance.LinkGoogleAccount(req.body.token, req.body.email);

				res.status(200).json('Success');
			} catch (e) {
				logger.error('🔥 error: %o', e.stack);
				return next(e);
			}
		},
	);
};
