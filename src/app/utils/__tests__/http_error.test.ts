import { fakeTimers } from '../../api/routes/__tests__/_common';
import HttpError from '../httpError';
import { Response } from 'express';
import { IError } from '../../shared/IError';
import HttpResponse from '../httpResponse';

describe('this tests http errors ', () => {
	beforeEach(() => fakeTimers());
	it('should test throw errors if null', () => {
		const errors = new HttpError('NOT FOUND', 404);
		const t = () => {
			HttpError.throwErrorIfNull(false, 'NOT FOUND', 404);
		};
		expect(errors).toBeDefined();
		expect(t).toThrow(errors);
		expect(t).toThrow('NOT FOUND');
	}, 100);

	it('should test send error response', async () => {
		const iError: IError = {
			message: 'NOT FOUND',
			stack: 'NOT FOUND',
			statusCode: 500,
		};

		const resp = new HttpResponse();
		// @ts-ignore
		//
		const s: Response = new HttpResponse();

		const express = require('express');
		const path = require('path');
		const app = express();
		app.use(express.json());
		app.use(express.urlencoded({ extended: true }));
		app.get('/', (req, res) => {
			HttpResponse.sendResponse(res, 404, true, '');
			HttpError.sendErrorResponse(iError, res);
		});
	});
});
