import Container, { Inject, Service } from 'typedi';
import { EventBus } from '../../../shared/domain/DomainEvents/EventBus';
import { BadRequest, ElementNotFound, InvalidID } from '../../../shared/domain/Http/Errors';
import { RepositoryFactory } from '../../../shared/domain/Repositories/RepositoryFactory';
import { Entity } from '../../../shared/domain/Types/Entity';
import { UuidValueObject } from '../../../shared/domain/ValueObjects/UuidValueObject';
import { Profile } from '../domain/Profile';
import { ProfileJsonDocument } from '../domain/types/ProfileJsonDocument';

@Service('ProfilesService')
export class ProfilesService {
	private readonly repository = Container.get<RepositoryFactory>('RepositoryFactory').create<Profile, ProfileJsonDocument>(
		Profile
	);
	constructor(@Inject('EventBus') private readonly eventBus: EventBus) {}

	public async createProfile(profile: ProfileJsonDocument): Promise<ProfileJsonDocument> {
		let count = await this.repository.count({ where: { name: profile.name } });
		if (count > 0) throw new BadRequest('This profile is already created, please rename the profile');

		const newProfile = new Profile(profile);
		await this.repository.insert(newProfile.toPrimitives());

		return newProfile.toEntity();
	}

	public async updateProfile(profileId: string, profileUpdate: ProfileJsonDocument): Promise<ProfileJsonDocument | undefined> {
		let profile = await this.repository.exists(profileId);
		if (!profile) throw new ElementNotFound('This profile doesn`t exists');

		await this.repository.update(profileId, profileUpdate);

		let updatedProfile = await this.repository.get(profileId);
		return updatedProfile?.toEntity();
	}

	public async listProfiles(options?: any): Promise<{ data: Array<ProfileJsonDocument>; count: number }> {
		let [data, count] = await Promise.all([this.repository.list(options), this.repository.count(options)]);
		return {
			data: Entity.toArray(data) || [],
			count,
		};
	}

	public async getProfile(profileId: string): Promise<ProfileJsonDocument | undefined> {
		let validId = UuidValueObject.validateID(profileId);
		if (!validId) throw new InvalidID('The given id has an incorrect format');
		let profile = await this.repository.get(profileId);
		console.log(profile);
		return profile?.toEntity();
	}
}
