import { Request, Response } from 'express';
import { Controller, Get, Post, Req, Res, UseBefore } from 'routing-controllers';
import { Inject } from 'typedi';
import { Created, Success } from '../../../contexts/shared/domain/Http/Response';
import { verify } from '../../../contexts/WorkProgretion/Users/infraestructure/PassportJWT';
import { UserAccessService } from '../../../contexts/WorkProgretion/Users/services/UserAccessService';

@Controller('/auth')
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
