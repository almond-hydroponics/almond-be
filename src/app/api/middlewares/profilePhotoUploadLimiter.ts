import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

const profilePhotoUploadLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 10,
	handler: (req: Request, res: Response) => {
		res.status(429).json({
			errors: {
				message: 'Too many photos uploaded, please try after an hour',
			},
		});
	},
});

export default profilePhotoUploadLimiter;
