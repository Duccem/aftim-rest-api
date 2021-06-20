import { omit } from 'lodash';
import Container from 'typedi';
import { GeneralError } from '../../domain/Errors/Errors';
import { Logger } from '../Logger';

export const GraphErrorHandler = function (error: any): any {
	const logger = Container.get<Logger>('Logger');
	error = error.originalError;
	if (error instanceof GeneralError) {
		if (error.message) logger.error(`${error.getCode()} ${error.getMessage()}`);
		error = omit(error, 'extensions.exception');
		return error;
	}
	logger.error(`500 ${error.message} ${error.extensions.exception}`);
	return omit(new GeneralError('Internal Server Error', 500), 'extensions.exception');
};
