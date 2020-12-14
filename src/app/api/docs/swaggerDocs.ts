import swaggerJsdoc from 'swagger-jsdoc';

const options = {
	definition: {
		info: {
			title: 'Almond API',
			version: '0.0.1',
			description: 'Almond Backend API',
			license: {
				name: 'MIT',
				url: 'https://spdx.org/licenses/MIT.html',
			},
			contact: {
				name: 'almond Developers',
				url: 'https://almondfroyo.com',
				email: 'info@email.com',
			},
		},
		schemes: ['http', 'https'],
		securityDefinitions: {
			JWT: {
				type: 'apiKey',
				in: 'header',
				name: 'Authorization',
				description: '',
			},
		},
		servers: [
			{
				url: 'http://localhost:8080',
			},
		],
	},
	apis: ['./src/api/**.js', './src/api/routes/**.ts'],
};

export const swaggerSpecs = swaggerJsdoc(options);
