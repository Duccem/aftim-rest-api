import onHeaders from 'on-headers';
import { colors, Logger } from './Logger';

/**
 * Middleware that log the request and response that recive or send the server
 */
export class NetLogger {
	private static logger: Logger = new Logger();

	//-------------------------Request methods------------------------//
	/**
	 * Extract and log the method of the request
	 * @param request
	 */
	private static method(request: any): string {
		let methodString = request.method;
		switch (methodString) {
			case 'GET':
				methodString = this.logger.text(methodString, colors.SUCCESS);
				break;
			case 'POST':
				methodString = this.logger.text(methodString, colors.INFO);
				break;
			case 'PUT':
				methodString = this.logger.text(methodString, colors.WARNING);
				break;
			case 'DELETE':
				methodString = this.logger.text(methodString, colors.ERROR);
				break;
			default:
				break;
		}
		return methodString;
	}

	/**
	 * Extract and log the http version of the request
	 * @param request
	 */
	private static httpVersion(request: any): string {
		let httpVersionString = request.httpVersion;
		return httpVersionString;
	}

	/**Extract and log the URL requested
	 *
	 * @param request
	 */
	private static url(request: any): string {
		let urlString = request.originalUrl;

		urlString = this.logger.text(urlString, colors.INFO);

		return urlString;
	}

	private static ip(request: any): string {
		let ip = request.ip;
		let formattedIp = this.logger.text(ip, colors.SUCCESS);
		return formattedIp;
	}

	//-------------------------Response methods------------------------//

	/**
	 * Extract and log the status of the response
	 * @param response
	 */
	private static status(response: any): string {
		//Extract the status
		let statusString = response.statusCode || '-';

		statusString = new String(statusString);

		switch (statusString[0]) {
			case '2': //if is a ok code
				statusString = this.logger.text(statusString, colors.SUCCESS);
				break;

			case '3': // if is a non change code
				statusString = this.logger.text(statusString, colors.INFO);
				break;

			case '4': // if is a bad request code
				statusString = this.logger.text(statusString, colors.WARNING);
				break;

			case '5': // if is an error code
				statusString = this.logger.text(statusString, colors.ERROR);
				break;
		}

		return statusString;
	}

	/**
	 * Extract and log the time that take the response
	 * @param digits fixed decimals time
	 * @param response
	 */
	private static responseTime(digits: number, request: any, response: any): string {
		digits = digits || 3;
		if (!response._startTime) response._startTime = process.hrtime();
		const elapsedTimeInMs = (
			(response._startTime[0] - request._startTime[0]) * 1e3 +
			(response._startTime[1] - request._startTime[1]) / 1e6
		).toFixed(digits);
		return elapsedTimeInMs;
	}

	/**
	 * Extract and log the size of the response
	 * @param response
	 */
	private static lenght(response: any): string {
		let lenght = response.get('content-length') || '-';
		return lenght;
	}

	/**
	 * Log the request
	 * @param request
	 */
	public static Request(request: any): void {
		let method = this.method(request);
		let httpVersion = this.httpVersion(request);
		let url = this.url(request);
		let ip = this.ip(request);
		let log = `Requested ${method} ${httpVersion} ${url} from ${ip}`;
		this.logger.request(log);
	}

	/**
	 * Log the response
	 * @param request
	 * @param response
	 */
	public static Response(request: any, response: any): void {
		let time = this.responseTime(3, request, response);
		let url = this.url(request);
		let status = this.status(response);
		let lenght = this.lenght(response);
		let ip = this.ip(request);
		let log = `Responded to ${url} requested by ${ip} with status ${status} (${lenght}) bytes in ${time} miliseconds`;
		this.logger.response(log);
	}
}

/**
 * Function middleware to handle the logs
 */
export default function ducentrace() {
	return async (request: any, response: any, next: any) => {
		NetLogger.Request(request);
		startRecording.call(request);
		onHeaders(response, startRecording);
		await next();
		NetLogger.Response(request, response);
	};
}

function startRecording(this: any) {
	this._startTime = process.hrtime();
}
