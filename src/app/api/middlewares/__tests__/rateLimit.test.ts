import { rateLimiterUsingThirdParty } from '../rateLimit';

describe('Test Rate limit', () => {
	it('generates rate limit', () => {
		// @ts-ignore
		let limit = rateLimiterUsingThirdParty({
			windowMs: 24 * 60 * 60 * 1000, // 24 hrs in millziseconds
			max: 200,
			message: 'You have exceeded the 200 requests in 24 hrs limit!',
			headers: true,
		});
		expect(limit);
	});
});
