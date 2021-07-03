import { NextFunction, Response } from 'express';
import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import Container from 'typedi';
import { RequestTokenized } from '../../domain/Auth/IResquest';
import { GeneralError } from '../../domain/Http/Errors';
import { Logger } from '../Development/Logger';

@Middleware({ type: 'after' })
export class RESTErrorHandler implements ExpressErrorMiddlewareInterface {
	/**
	 * REST Error handler, catch all errors ocurred in the execution of a request
	 * @param err The Error
	 * @param req The Request object
	 * @param res The Response Object
	 * @param next The next function on the stack
	 */
	error(err: any, req: RequestTokenized, res: Response, next: NextFunction): Response {
		const logger = Container.get<Logger>('Logger');
		if (err instanceof GeneralError) {
			if (err.message) logger.error(err.getMessage());
			return res.status(err.getCode()).json({
				message: err.getMessage(),
			});
		}
		logger.error(err.message);
		return res.status(500).json({
			message: 'Internal Server Error',
		});
	}
}
