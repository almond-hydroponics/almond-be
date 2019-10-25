import { Router } from 'express';
import schedules from './routes/schedule';
import auth from './routes/auth';
import user from './routes/user';

// guaranteed to get dependencies
export default () => {
  const app = Router();
  schedules(app);
  auth(app);
  user(app);
  // agendash(app);

  return app
}
