import isArrayNotNull from './isArrayNotNull';

describe('The isArrayNotNull function', () => {
	it('should return true if the array has a value', () => {
		const arr = [{ name: 'Masha' }];
		const check = isArrayNotNull(arr);

		expect(check).toBeTruthy();
	});

	it('should return false if the array is null', () => {
		const arr: string[] = [];
		const check = isArrayNotNull(arr);

		expect(check).toBeFalsy();
	});
});
