import { config } from '../../config';
import EmailSequenceJob from '../jobs/emailSequence';
import ConnectivityWorker from '../jobs/connectivityWorker';

export default ({ agenda }) => {
	agenda.define(
		'send-email',
		{ priority: 'high', concurrency: config.agenda.concurrency },
		new EmailSequenceJob().handler,
		new ConnectivityWorker().internetStatusLogger(),
	);
	agenda.start();
};
