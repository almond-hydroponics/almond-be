import isArrayNotNull from '../isArrayNotNull';
jest.useFakeTimers();

describe('The isArrayNotNull function', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  })
	it('should return true if the array has a value', () => {
		const arr = [1,2,3];
		const check = isArrayNotNull(arr);
		expect(check).toBeTruthy();
	});

	it('should return false if the array is null', () => {
		const arr: string[] = [];
		const check = isArrayNotNull(arr);
		expect(check).toBeFalsy();
	});
});
