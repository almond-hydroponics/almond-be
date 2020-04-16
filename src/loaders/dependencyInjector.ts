import { Container } from 'typedi';
import agendaFactory from './agenda';
import { AppLogger } from './logger';

export default ({ mongoConnection, models }: { mongoConnection; models: { name: string; model: any }[] }) => {
  const logger = new AppLogger('Loaders');
  try {
    models.forEach(m => {
      Container.set(m.name, m.model);
    });

    const agendaInstance = agendaFactory({ mongoConnection });

    Container.set('agendaInstance', agendaInstance);
    Container.set('logger', logger);

    logger.log('✌️ Agenda injected into container');

    return { agenda: agendaInstance };
  } catch (e) {
    logger.error('🔥 Error on dependency injector loader: %o', e.stack);
    throw e;
  }
};
