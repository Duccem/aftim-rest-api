import { Response } from 'express';
import { Controller, Get, Post, Req, Res, UseAfter, UseBefore } from 'routing-controllers';
import { Inject } from 'typedi';
import { ProfilesService } from '../../../contexts/ClientAttention/Profiles/services/PoliciesService';
import { verify } from '../../../contexts/ClientAttention/Users/infraestructure/PassportJWT';
import { RequestTokenized } from '../../../contexts/shared/domain/Auth/IResquest';
import { RESTErrorHandler } from '../../../contexts/shared/infraestructure/Errors/RESTErrorHandler';

@Controller('/profile')
@UseBefore(verify)
@UseAfter(RESTErrorHandler)
export class ProfileController {
	constructor(
		@Inject('ProfilesService') private profileService: ProfilesService // @Inject('PoliciesPermissionsService') private permissionsService: PoliciesPermissionsService
	) {}

	@Get()
	async list(@Req() request: RequestTokenized, @Res() res: Response) {
		let data = await this.profileService.listProfiles();
		return res.status(200).json(data);
	}

	@Get('/:id')
	async get(@Req() request: RequestTokenized, @Res() res: Response) {
		let data = await this.profileService.getProfile(request.params.id);
		return res.status(200).json(data);
	}

	@Post()
	async create(@Req() request: RequestTokenized, @Res() res: Response) {
		let data = await this.profileService.createProfile(request.body);
		return res.status(201).json(data);
	}
}
