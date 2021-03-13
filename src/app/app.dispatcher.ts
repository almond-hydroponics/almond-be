import express from 'express';
import { AppLogger } from './app.logger';
import { config } from '../config';
import * as loaders from './loaders';
import { errorHandler } from './utils/errorHandler';

const { port = 8080 } = config;

export class AppDispatcher {
	private app: express.Application = express();
	private logger = new AppLogger(AppDispatcher.name);

	async dispatch(): Promise<void> {
		await this.createServer();
		return this.startServer();
	}

	private async createServer(): Promise<void> {
		await loaders.default({ expressApp: this.app });
	}

	async shutdown(): Promise<void> {
		await this.logger.log('Shutdown');
	}

	private async startServer(): Promise<void> {
		process.on('unhandledRejection', (reason: Error, promise: Promise<any>) => {
			throw reason;
		});

		process.on('uncaughtException', (error: Error) => {
			errorHandler.handleError(error);
			if (!errorHandler.isTrustedError(error)) {
				process.exit(1);
			}
		});

		await this.app.listen(port);

		this.logger.log(`
      ######################################################
      😎 Swagger is exposed at http://${config.host}:${config.port}/api-docs 😎
      ######################################################
		`);

		this.logger.log(`
      ######################################################
      😎 Server is listening http://${config.host}:${config.port} 😎
      ######################################################
    `);
	}
}
