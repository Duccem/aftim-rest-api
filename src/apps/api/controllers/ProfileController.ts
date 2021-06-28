import { Controller, Get, Post, Req, UseBefore } from 'routing-controllers';
import { Inject } from 'typedi';
import { ProfilesService } from '../../../contexts/ClientAttention/Profiles/services/PoliciesService';
import { verify } from '../../../contexts/ClientAttention/Users/infraestructure/PassportJWT';
import { RequestTokenized } from '../../../contexts/shared/domain/Auth/IResquest';
import { Paginator } from '../../../contexts/shared/domain/Http/Paginator';
import { Created, Founded, Listed } from '../../../contexts/shared/domain/Http/Response';

@Controller('/profile')
@UseBefore(verify)
export class ProfileController {
	constructor(
		@Inject('ProfilesService') private profileService: ProfilesService // @Inject('PoliciesPermissionsService') private permissionsService: PoliciesPermissionsService
	) {}

	@Get()
	async list(@Req() request: RequestTokenized) {
		let data = await this.profileService.listProfiles(request.query);
		let paginator = new Paginator(request, data);
		return new Listed(paginator.payload);
	}

	@Get('/:id')
	async get(@Req() request: RequestTokenized) {
		let data = await this.profileService.getProfile(request.params.id);
		return new Founded(data);
	}

	@Post()
	async create(@Req() request: RequestTokenized) {
		let data = await this.profileService.createProfile(request.body);
		return new Created(data);
	}
}
