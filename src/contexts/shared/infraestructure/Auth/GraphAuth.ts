import { MiddlewareInterface, NextFn, ResolverData } from 'type-graphql';
import { Inject } from 'typedi';
import { Auth } from '../../../ClientAttention/Users/domain/Interfaces/Auth';
import { AuthMiddleWare } from '../../domain/Auth/AuthMiddleware';
import { RequestContext } from '../../domain/Auth/IResquest';
import { Unauthorized } from '../../domain/Http/Errors';

export class GraphAuth implements AuthMiddleWare, MiddlewareInterface<RequestContext> {
	constructor(@Inject('Auth') private auth: Auth) {}
	public async use({ context: { req } }: ResolverData<RequestContext>, next: NextFn): Promise<any> {
		try {
			const token = <string>req.headers.authorization?.split(' ')[1];
			if (!token) return new Unauthorized('Token is absent', 401);
			const userVerifiedToken = this.auth.verifyToken(token);
			req.user = userVerifiedToken;
			await next();
		} catch (error) {
			throw error;
		}
	}
}
