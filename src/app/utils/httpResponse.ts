import { Response } from 'express';

class HttpResponse {
	static sendResponse(
		res: Response,
		code: number,
		success: boolean,
		message: string,
		data?: any,
	): Response<never> {
		return res.status(code).send({
			success,
			message,
			data,
		});
	}
}

export default HttpResponse;
