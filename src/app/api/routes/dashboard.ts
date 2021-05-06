import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';
import DashboardService from '../../services/dashboard';
import middlewares from '../middlewares';
import { AppLogger } from '../../app.logger';

const { isAuth, attachCurrentUser } = middlewares;

const log = new AppLogger('DASHBOARD');
const dash = Router();

const summary = {
	users: 0,
	devices: 0,
};

export default (app: Router): void => {
	app.use('/', dash);
	dash.get(
		'/dashboard',
		isAuth,
		attachCurrentUser,
		async (req: Request, res: Response, next: NextFunction) => {
			log.debug('[dashboard] calling the dashboard endpoint');
			try {
				const dashboardService = Container.get(DashboardService);

				await dashboardService.GetUsersSummary().then((res) => {
					log.debug(`[dashboard] populating ${res.valueOf()} user(s)`);
					summary.users = res.valueOf();
				});

				await dashboardService.GetDeviceSummary().then((res) => {
					log.debug(`[dashboard] populating ${res.valueOf()} device(s)`);
					summary.devices = res.valueOf();
				});

				return res.status(200).send({
					success: true,
					message: 'Summary fetched successfully',
					data: summary,
				});
			} catch (e) {
				log.error('🔥 error: %o', e.stack);
				return next(e);
			}
		},
	);
};
