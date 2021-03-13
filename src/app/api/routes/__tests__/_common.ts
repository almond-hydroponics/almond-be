describe('test common functions used on tests', () => {
	it('should initialize the within the tests', () => {
		expect(true).toBeTruthy();
	});
});

const fakeTimers = () => {
	console.log('🧪 exec fake timers 🧪');
	return jest.useFakeTimers();
};

export { fakeTimers };
