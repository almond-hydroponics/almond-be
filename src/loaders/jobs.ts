import { config } from '../config';
import EmailSequenceJob from '../jobs/emailSequence';
import PumpScheduleJob from '../jobs/pumpSchedule';
import * as Agenda from 'agenda';

export default ({ agenda }: { agenda: Agenda } ) => {
  agenda.define(
    'send-email',
    { priority: 'high', concurrency: config.agenda.concurrency },
    new EmailSequenceJob().handler,
  );

  agenda.define(
    'pump-schedules',
    { priority: 'high', concurrency: config.agenda.concurrency },
    new PumpScheduleJob().handler,
  );

  agenda.start();
};
