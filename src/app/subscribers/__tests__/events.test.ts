import { fakeTimers } from '../../api/routes/__tests__/_common';

import events from '../events';

describe('tests events subscriber', () => {
	beforeEach(() => fakeTimers());
	it('should test the default from events', () => {
		const user = events.user;
		expect(user.signIn).toBeDefined();
		expect(user.signIn).toBeDefined();
	});
});
