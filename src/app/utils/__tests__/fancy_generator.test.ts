import { fakeTimers } from '../../api/routes/__tests__/_common';
import { uid } from '../fancyGenerator';

describe('this tests the fancy generator utility', () => {
	beforeEach(() => fakeTimers());
	it('should test the fancy generator util on generated', () => {
		const generated = uid.generate();
		expect(generated).toBeDefined();
	}, 1000);

	it('should test the fancy generator util on timestamp is true', () => {
		const timeStamp = uid.timestamp(uid.generate(), true);
		expect(timeStamp).toBeDefined();
	}, 1000);

	it('should test the fancy generator util on timestamp is false', () => {
		const timeStamp = uid.timestamp(uid.generate(), false);
		expect(timeStamp).toBeDefined();
	}, 1000);
});
