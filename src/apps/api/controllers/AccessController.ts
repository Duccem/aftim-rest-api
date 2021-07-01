import { Request, Response } from 'express';
import { Controller, Get, Post, Req, Res, UseAfter, UseBefore } from 'routing-controllers';
import { Inject } from 'typedi';
import { verify } from '../../../contexts/ClientAttention/Users/infraestructure/PassportJWT';
import { UserAccessService } from '../../../contexts/ClientAttention/Users/services/UserAccessService';
import { Created, Success } from '../../../contexts/shared/domain/Http/Response';
import { RESTErrorHandler } from '../../../contexts/shared/infraestructure/Errors/RESTErrorHandler';

@Controller('/auth')
@UseAfter(RESTErrorHandler)
export class AccessController {
	constructor(@Inject('UserAccessService') private readonly userAccessService: UserAccessService) {}
	@Post('/signup')
	async signUp(@Req() req: Request, @Res() res: Response) {
		let actor = req.body;
		let responseBody = await this.userAccessService.signup(actor);
		return new Created(responseBody);
	}

	@Post('/login')
	async login(@Req() req: Request, @Res() res: Response) {
		let { username, password } = req.body;
		let responseBody = await this.userAccessService.login(username, password);
		return new Success(responseBody);
	}

	@Get('/ping')
	@UseBefore(verify)
	ping() {
		return 'ping';
	}
}
