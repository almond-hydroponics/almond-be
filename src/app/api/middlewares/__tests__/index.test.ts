import attachCurrentUser from '../attachCurrentUser';
import isAuth from '../isAuth';
import checkRole from '../checkRole';
import { clearAllCache, clearCache, getCache, setCache } from '../cache';
import { rateLimiterUsingThirdParty } from '../rateLimit';
import * as re from 'express';

describe('Test Pull all middlewares', () => {
	it('should be able to test the roles and determine that it fails', () => {
		expect(attachCurrentUser).toBeDefined();
		const x = attachCurrentUser(re.request, re.response, () => {
			console.log('yes');
		});
		expect(isAuth).toBeDefined();
		expect(checkRole).toBeDefined();
		expect(getCache).toBeDefined();
		expect(setCache).toBeDefined();
		expect(clearCache).toBeDefined();
		expect(clearAllCache).toBeDefined();
		expect(rateLimiterUsingThirdParty).toBeDefined();
	});
});
