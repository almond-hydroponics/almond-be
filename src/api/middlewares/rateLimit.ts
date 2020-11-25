import rateLimit from 'express-rate-limit';

export const rateLimiterUsingThirdParty = rateLimit({
	windowMs: 24 * 60 * 60 * 1000, // 24 hrs in milliseconds
	max: 200,
	message: 'You have exceeded the 200 requests in 24 hrs limit!',
	headers: true,
});
