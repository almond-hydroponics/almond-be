import path from 'path';
import fs from 'fs';
import clfDate from 'clf-date';
import { createLogger, format, Logger, transports, addColors } from 'winston';
import appRoot from 'app-root-path';
import { config } from '../config';
import { LoggerService } from '../types/logger-service';
import { Request, Response } from 'express';

const { combine, timestamp, printf } = format;

// ensure log directory exists
const logDirectory = path.resolve(`${appRoot}`, 'logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const now = new Date();
const logfileName = `app-${now.getFullYear()}-${now.getMonth()}-${now.getDate()}.log`;

const customLevels = {
	levels: {
		trace: 5,
		debug: 4,
		info: 3,
		warn: 2,
		error: 1,
		fatal: 0,
	},
	colors: {
		trace: 'white',
		debug: 'blue',
		info: 'green',
		warn: 'yellow',
		error: 'red',
		fatal: 'red',
	},
};

export class AppLogger implements LoggerService {
	private logger: Logger;

	constructor(label: string) {
		const formatter = combine(
			format.label({ label }),
			timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
			format.splat(),
			format.json(),
			printf((info) => {
				const { timestamp, level, message, label, ...meta } = info;
				return `${timestamp} [${label}] [${level.toUpperCase()}]: ${message} ${
					Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
				}`;
			}),
		);

		const options = {
			file: {
				level: 'info' || 'error',
				filename: path.resolve(logDirectory, logfileName),
				handleExceptions: false,
				json: true,
				maxsize: 5242880, // 5MB
				// maxFiles: 5,
				maxAgeDays: 14,
				colorize: false,
			},
			console: {
				format: format.combine(format.cli(), format.splat()),
			},
		};

		this.logger = createLogger({
			format: formatter,
			level: config.logs.level,
			levels: customLevels.levels,
			transports: [
				process.env.NODE_ENV !== 'development'
					? new transports.File(options.file)
					: new transports.Console(options.console),
			],
			exitOnError: false,
		});
		addColors(customLevels.colors);
	}

	stream(): void {
		this.logger.stream({
			write: (message, encoding) => this.logger.log(message),
		});
	}

	trace(message: string, meta?: any): void {
		this.logger.log('trace', message, meta);
	}

	debug(message: string, meta?: any): void {
		this.logger.debug(message, meta);
	}

	log(message: string, meta?: any): void {
		this.logger.info(message, meta);
	}

	warn(message: string, meta?: any): void {
		this.logger.warn(message, meta);
	}

	error(message: string, meta?: any): void {
		this.logger.error(message, meta);
	}

	fatal(message: string, meta?: any) {
		this.logger.log('fatal', message, meta);
	}
	// :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"
	combinedFormat(err: any, req: Request, res: Response): string {
		return `${req.ip} - - [${clfDate(new Date())}] \"${req.method} ${
			req.originalUrl
		} HTTP/${req.httpVersion}\" ${err.status || 500} - ${
			req.headers['user-agent']
		}`;
	}
}
