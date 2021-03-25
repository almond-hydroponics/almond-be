import { fakeTimers } from '../../api/routes/__tests__/_common';
import { getObjectId, getObjectIds } from '../deviceId';

describe('test utils device id', () => {
	beforeEach(() => {
		fakeTimers();
	});

	it('should test device id utils', () => {
		expect(getObjectId).toBeDefined();
	});

	it('should test getObjectIds id utils', () => {
		expect(getObjectIds).toBeDefined();
	});
});
