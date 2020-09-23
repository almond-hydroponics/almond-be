import { createLogger, format, Logger, transports } from 'winston';
import { config } from '../config';
import { LoggerService } from '../types/logger-service';

const { combine, timestamp, printf } = format;

export class AppLogger implements LoggerService {
	private logger: Logger;

	constructor(label: string) {
		const options = {
			file: {
				level: 'info' || 'error',
				filename: `${__dirname}/../../logs/app.log`,
				handleExceptions: true,
				json: true,
				maxsize: 5242880, // 5MB
				maxFiles: 5,
				colorize: false,
			},
		};

		this.logger = createLogger({
			format: combine(
				format.label({ label }),
				timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
				format.splat(),
				format.json(),
				printf(
					({ level, message, label, timestamp }) =>
						`${timestamp} [${label}] ${level.toUpperCase()} - ${message}`,
				),
			),
			level: config.logs.level,
			transports: [
				process.env.NODE_ENV !== 'development'
					? new transports.File(options.file)
					: new transports.Console({
							format: format.combine(format.cli(), format.splat()),
					  }),
			],
		});
	}

	error(message: string, trace: string): void {
		this.logger.error(message, trace);
	}

	warn(message: string): void {
		this.logger.warn(message);
	}

	log(message: string): void {
		this.logger.info(message);
	}

	verbose(message: string): void {
		this.logger.verbose(message);
	}

	debug(message: string): void {
		this.logger.debug(message);
	}

	silly(message: string): void {
		this.logger.silly(message);
	}
}
