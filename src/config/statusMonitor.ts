const statusMonitor = {
	title: 'Almond Status',
	path: '/status',
	spans: [
		{
			interval: 1,
			retention: 60,
		},
		{
			interval: 5,
			retention: 60,
		},
		{
			interval: 15,
			retention: 60,
		},
	],
	chartVisibility: {
		cpu: true,
		mem: true,
		load: true,
		responseTime: true,
		rps: true,
		statusCodes: true,
	},
	healthChecks: [
		{
			protocol: 'http',
			host: 'localhost',
			path: '/admin/health/ex1',
			port: '8080',
		},
	],
	ignoreStartsWith: '/admin',
};

export default statusMonitor;
