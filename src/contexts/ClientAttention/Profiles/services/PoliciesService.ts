import { Inject, Service } from 'typedi';
import { EventBus } from '../../../shared/domain/DomainEvents/EventBus';
import { BadRequest, ElementNotFound, InvalidID } from '../../../shared/domain/Errors/Errors';
import { Repository } from '../../../shared/domain/Repositories/Repository';
import { UuidValueObject } from '../../../shared/domain/ValueObjects/UuidValueObject';
import { Profile } from '../domain/Profile';
import { ProfileJsonDocument } from '../domain/types/ProfileJsonDocument';

@Service('ProfilesService')
export class ProfilesService {
	constructor(
		@Inject('Repository') private readonly repository: Repository,
		@Inject('EventBus') private readonly eventBus: EventBus
	) {}

	public async createProfile(profile: ProfileJsonDocument): Promise<ProfileJsonDocument> {
		let count = await this.repository.count('profile', { where: { name: profile.name } });
		if (count > 0) throw new BadRequest('This profile is already created, please rename the profile');

		const newProfile = new Profile(profile);
		await this.repository.insert('profile', newProfile.toPrimitives());

		return newProfile.toEntity();
	}

	public async updateProfile(profileId: string, profileUpdate: ProfileJsonDocument): Promise<ProfileJsonDocument | undefined> {
		let profile = await this.repository.exists('profile', profileId);
		if (!profile) throw new ElementNotFound('This profile doesn`t exists');

		await this.repository.update('profile', profileId, profileUpdate);

		let updatedProfile = await this.repository.get<Profile>(Profile)(profileId);
		return updatedProfile?.toEntity();
	}

	public async listProfiles(): Promise<Array<ProfileJsonDocument>> {
		let data = await this.repository.list<Profile>(Profile)({});
		return data[0]?.toArray(data) || [];
	}

	public async getProfile(profileId: string): Promise<ProfileJsonDocument | undefined> {
		let validId = UuidValueObject.validateID(profileId);
		if (!validId) throw new InvalidID('The given id has an incorrect format');
		let profile = await this.repository.get<Profile>(Profile)(profileId);
		console.log(profile);
		return profile?.toEntity();
	}
}
