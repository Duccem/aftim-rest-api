import { Response } from 'express';
import { Action, Interceptor, InterceptorInterface } from 'routing-controllers';
import { GeneralResponse } from '../../domain/Http/Response';

@Interceptor()
export class RESTResponseHandler implements InterceptorInterface {
	/**
	 * REST Response handler, transform the response into a http response
	 * @param action controller action properties
	 * @param content data returned
	 */
	intercept(action: Action, content: any): Response {
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
	}
}
