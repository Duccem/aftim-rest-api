import { format } from 'date-fns';
import fs from 'fs-extra';
import path from 'path';
/**
 * cont types of logers
 */
const types: any = {
	server: '[SERVER]',
	database: '[DATABASE]',
	cache: '[CACHE]',
	messageQ: '[MESSAGE QUEUE]',
	request: '[REQUESTED]',
	response: '[RESPONSE]',
	error: '[ERROR]',
	files: '[FILE]',
	message: '[MESSAGE]',
	system: '[SYSTEM]',
};

/**
 * color of loggers
 */
export enum colors {
	NULL = '\x1b[30m',
	ERROR = '\x1b[31m',
	SUCCESS = '\x1b[32m',
	WARNING = '\x1b[33m',
	INFO = '\x1b[34m',
	SYSTEM = '\x1b[35m',
	IMPORTANT = '\x1b[36m',
	MESSAGE = '\x1b[37m',
}

/**
 * Backgrounds of loggers
 */
const background: any = {
	null: '\x1b[40m',
	error: '\x1b[41m',
	success: '\x1b[42m',
	warning: '\x1b[43m',
	info: '\x1b[44m',
	system: '\x1b[45m',
	important: '\x1b[46m',
	message: '\x1b[47m',
};

/**
 * Typography type
 */
const decorators: any = {
	reset: '\x1b[0m',
	bright: '\x1b[1m',
	dim: '\x1b[2m',
	underscore: '\x1b[4m',
	blink: '\x1b[5m',
	reverse: '\x1b[7m',
	hidden: '\x1b[8m',
};

/**
 * Config of the logger constructor
 */
export interface ILoggerConfig {
	mode?: string;
	format?: string;
}

/**
 * Logger class to print with colors or format epcified
 */
export class Logger {
	private mode: string;
	private format: string;

	constructor(options: ILoggerConfig = {}) {
		this.mode = options.mode || 'dev';
		this.format = options.format || 'iso';
	}

	get logMode() {
		return this.mode;
	}
	set logMode(newMode: string) {
		this.mode = newMode;
	}

	get dateFormat() {
		return this.format;
	}
	set dateFormat(format) {
		this.format = format;
	}

	/**
	 * Time setter
	 */
	protected date(): string {
		let currentDate = new Date();
		let formattedDate = '';
		switch (this.format) {
			case 'large':
				formattedDate = format(currentDate, 'cccc, MMMM Do yyyy, h:mm:ss.SSS a');
				break;
			case 'utc':
				formattedDate = format(currentDate, 'dd, cccc MMM yyyy HH:mm:ss.SSS');
				break;
			case 'clf':
				formattedDate = format(currentDate, 'dd/MMM/yyyy:HH:mm:ss.SSS');
			case 'iso':
				formattedDate = format(currentDate, 'yyyy-MM-dd HH:mm:ss.SSS');
				break;
			default:
				break;
		}

		return formattedDate;
	}

	/**
	 * Function that write the file
	 * @param message string to write
	 */
	protected fileWrite(message: any) {
		const date = format(new Date(), 'yyyy-MM-dd');
		let file = fs.createWriteStream(path.resolve(process.cwd(), `logs/${date}.log`), { flags: 'a' });
		file.write(message + '\n');
	}

	/**
	 * return the string colorized
	 * @param msg string message
	 * @param format color format
	 */
	public text(message: string, color: string): string {
		return color + message + decorators.reset;
	}

	/**
	 * the function responsable for the log
	 * @param options object tha contain the type, color and message
	 */
	public log(message: any) {
		console.log(`${this.text('[MESSAGE]', colors.MESSAGE)} (${this.text(this.date(), colors.MESSAGE)}) ${message}`);
		if (this.mode == 'prod') {
			let log = `[MESSAGE] ${'(' + this.date() + ')'} ${message}`;
			this.fileWrite(log);
		}
	}

	public error(message: any) {
		console.log(`${this.text('[ERROR]', colors.ERROR)} (${this.text(this.date(), colors.ERROR)}) ${message}`);
		if (this.mode == 'prod') {
			let log = `[ERROR] ${'(' + this.date() + ')'} ${message}`;
			this.fileWrite(log);
		}
	}

	public request(message: any) {
		console.log(`${this.text('[REQUESTED]', colors.IMPORTANT)} (${this.text(this.date(), colors.IMPORTANT)}) ${message}`);
		if (this.mode == 'prod') {
			let log = `[REQUESTED] ${'(' + this.date() + ')'} ${message}`;
			this.fileWrite(log);
		}
	}

	public response(message: any) {
		console.log(`${this.text('[RESPONSE]', colors.SUCCESS)} (${this.text(this.date(), colors.SUCCESS)}) ${message}`);
		if (this.mode == 'prod') {
			let log = `[RESPONSE] ${'(' + this.date() + ')'} ${message}`;
			this.fileWrite(log);
		}
	}
	public connection(message: any) {
		console.log(`${this.text('[CONNECTED]', colors.SYSTEM)} (${this.text(this.date(), colors.SYSTEM)}) ${message}`);
		if (this.mode == 'prod') {
			let log = `[CONNECTED] ${'(' + this.date() + ')'} ${message}`;
			this.fileWrite(log);
		}
	}

	public info(message: any) {
		console.log(`${this.text('[INFO]', colors.INFO)} (${this.text(this.date(), colors.INFO)}) ${message}`);
		if (this.mode == 'prod') {
			let log = `[INFO] ${'(' + this.date() + ')'} ${message}`;
			this.fileWrite(log);
		}
	}

	public launch(message: any) {
		console.log(`${this.text('[SERVER]', colors.WARNING)} (${this.text(this.date(), colors.WARNING)}) ${message}`);
		if (this.mode == 'prod') {
			let log = `[SERVER] ${'(' + this.date() + ')'} ${message}`;
			this.fileWrite(log);
		}
	}
}

const ducenlogger = new Logger();

export default ducenlogger;
