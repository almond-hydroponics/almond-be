import { IError } from '../shared/IError';
import { Response } from 'express';

class HttpError extends Error {
	private statusCode: number;
	constructor(message: string, code = 500) {
		super();
		this.message = message;
		this.statusCode = code;
	}

	static throwErrorIfNull(data: any, message: string, code = 404): void {
		if (!data) {
			throw new HttpError(message, code);
		}
	}

	static sendErrorResponse(error: IError, res: Response): void {
		const code = error.statusCode || 500;
		const { message } = error;
		if (typeof code === 'number') {
			res.status(code).json({
				success: false,
				message,
			});
		}
	}
}

export default HttpError;
