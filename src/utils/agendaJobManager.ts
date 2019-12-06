import { Container } from 'typedi';
import { config } from '../config';
import PumpScheduleJob from '../jobs/pumpSchedule';
import * as Agenda from 'agenda';

export function createAgenda(name, schedule) {
  const agenda: Agenda = Container.get('agendaInstance');
  agenda.define(
    name,
    { priority: 'high', concurrency: config.agenda.concurrency },
    new PumpScheduleJob().handler);
  agenda.every(schedule, name);
  agenda.start();
}
