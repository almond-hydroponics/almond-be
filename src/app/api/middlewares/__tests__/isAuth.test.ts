import request from 'supertest';
import isAuth from '../isAuth';
import { config } from '../../../../config';

const base_url = 'http://localhost';

const req = request(base_url);
const common_headers = { authorization: 'qqqqqq' };

describe('Test isAuth Token generator', () => {
	it('should generate a jwt token and authenticate', () => {
		console.log('test jwt token generation - confirm the jwt token');
	});
});
