import { Response } from 'express';
import { Action } from 'routing-controllers';
import { GeneralResponse } from '../../../shared/domain/Http/Response';
import { ResponseHandler } from '../../domain/Http/Handlers';

/**
 * REST Response handler, transform the response into a http response
 * @param action controller action properties
 * @param content data returned
 */
export const RESTResponseHandler: ResponseHandler = function (action: Action, content: any): Response {
	if (content instanceof GeneralResponse) {
		return action.response.status(content.getCode()).json({
			code: content.getCode(),
			message: content.getMessage(),
			payload: content.payload,
		});
	}
	return action.response.status(200).json({
		code: 200,
		message: 'Ok',
		payload: content,
	});
};
