import { Router } from 'express';
import schedules from './routes/schedule';

// guaranteed to get dependencies
export default () => {
  const app = Router();
  schedules(app);
  // user(app);
  // agendash(app);

  return app
}
