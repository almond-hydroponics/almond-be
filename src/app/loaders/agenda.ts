import Agenda from 'agenda';
import { config } from '../../config';

export default ({ mongoConnection }) =>
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	new Agenda({
		mongo: mongoConnection,
		db: { address: '', collection: config.agenda.dbCollection, options: {} },
		processEvery: config.agenda.pooltime,
		maxConcurrency: config.agenda.concurrency,
	}) as any;
/**
 * https://github.com/agenda/agenda#mongomongoclientinstance
 */
