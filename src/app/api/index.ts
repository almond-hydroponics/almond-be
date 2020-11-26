import { Router } from 'express';
import role from './routes/role';
import schedules from './routes/schedule';
import auth from './routes/auth';
import user from './routes/user';
import agendash from './routes/agendash';
import device from './routes/device';
import linkAccount from './routes/linkAccount';

// guaranteed to get dependencies
export default () => {
	const app = Router();
	schedules(app);
	auth(app);
	user(app);
	agendash(app);
	device(app);
	linkAccount(app);
	role(app);

	return app;
};
