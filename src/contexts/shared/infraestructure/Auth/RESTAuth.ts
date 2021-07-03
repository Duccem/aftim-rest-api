import { NextFunction, Response } from 'express';
import { Inject } from 'typedi';
import { Auth } from '../../../WorkProgretion/Users/domain/Interfaces/Auth';
import { AuthMiddleWare } from '../../domain/Auth/AuthMiddleware';
import { RequestTokenized } from '../../domain/Auth/IResquest';
import { Unauthorized } from '../../domain/Http/Errors';

export class RestAuth implements AuthMiddleWare {
	constructor(@Inject('Auth') private auth: Auth) {}
	public async use(req: RequestTokenized, res: Response, next: NextFunction): Promise<any> {
		try {
			const token = <string>req.headers.authorization?.split(' ')[1];
			if (!token) return next(new Unauthorized('Token is ausent', 401));
			const userVerifiedToken = this.auth.verifyToken(token);
			req.user = userVerifiedToken;
			next();
		} catch (error) {
			throw error;
		}
	}
}
