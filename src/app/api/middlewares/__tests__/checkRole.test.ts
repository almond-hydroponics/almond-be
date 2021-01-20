import checkRole from '../checkRole';
import request from 'supertest';

describe('Test Check Role', () => {
	it('should be able to test the roles and determine that it fails', () => {
		const role = checkRole('xx');
		expect(role).toBeDefined();
	});
});
