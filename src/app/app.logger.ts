import path from 'path';
import fs from 'fs';
import clfDate from 'clf-date';
import { createLogger, format, Logger, transports } from 'winston';
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

export class AppLogger implements LoggerService {
	private logger: Logger;

	constructor(label: string) {
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
					: new transports.Console(options.console),
			],
			exitOnError: false,
		});
	}

	stream(): void {
		this.logger.stream({
			write: (message, encoding) => this.logger.log(message),
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
	// :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"
	combinedFormat(err: any, req: Request, res: Response): string {
		return `${req.ip} - - [${clfDate(new Date())}] \"${req.method} ${
			req.originalUrl
		} HTTP/${req.httpVersion}\" ${err.status || 500} - ${
			req.headers['user-agent']
		}`;
	}
}
