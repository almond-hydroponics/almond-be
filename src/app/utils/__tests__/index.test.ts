import { fakeTimers } from '../../api/routes/__tests__/_common';
import { convertMinutesToSeconds } from '../index';

describe('this tests the utils index', () => {
	beforeEach(() => fakeTimers());
	it('should test convert minutes to seconds function', () => {
		const seconds = convertMinutesToSeconds(30);
		expect(seconds).toBeDefined();
		console.log(seconds);
	});
});
