import { Router } from 'express';
import schedules from './routes/schedule';

const app = Router();
schedules(app);

export default app;
