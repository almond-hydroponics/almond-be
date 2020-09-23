export declare type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose';
export interface LoggerService {
	log(message: any, context?: string): any;
	error(message: any, trace?: string, context?: string): any;
	warn(message: any, context?: string): any;
	debug?(message: any, context?: string): any;
	verbose?(message: any, context?: string): any;
}
