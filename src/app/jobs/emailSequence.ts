import { Container } from 'typedi';
import { AppLogger } from '../app.logger';
import MailerService from '../services/mailer';

export default class EmailSequenceJob {
	public async handler(job, done): Promise<void> {
		const logger = new AppLogger('Schedule');
		try {
			logger.debug('✌️ Email Sequence Job triggered!');
			const { email, name }: { [key: string]: string } = job.data;
			const mailerServiceInstance = Container.get(MailerService);
			await mailerServiceInstance.StartEmailSequence('WelcomeSequence', {
				email,
				name,
			});
			done();
		} catch (e) {
			logger.error('🔥 Error with Email Sequence Job:', e.stack);
			done(e);
		}
	}
}
