import { Inject, Service } from "typedi";

import { Repository } from '../../../shared/domain/Repositories/Repository'
import { EventBus } from '../../../shared/domain/DomainEvents/EventBus'
import { ProfileJsonDocument } from "../domain/types/ProfileJsonDocument";
import { BadRequest, ElementNotFound, InvalidID } from "../../../shared/domain/Errors/Errors";
import { Profile } from "../domain/Profile";
import { UuidValueObject } from "contexts/shared/domain/ValueObjects/UuidValueObject";
@Service("ProfilesService")
export class ProfilesService {
    constructor(
        @Inject("Repository") private readonly repository: Repository, 
		@Inject("EventBus") private readonly eventBus: EventBus
    ){}

    public async createProfile(profile: ProfileJsonDocument): Promise<ProfileJsonDocument>{
        let count = await this.repository.count('profile', { where: { name: profile.name } });
        if(count > 0) throw new BadRequest('This profile is already created, please rename the profile');

        const newProfile = new Profile(profile);

        await this.repository.insert('profile', newProfile.toPrimitives());

        return newProfile.toPrimitives();
    }

    public async updateProfile(profileId: string, profileUpdate: ProfileJsonDocument): Promise<ProfileJsonDocument>{
        let profile = await this.repository.exists('profile', profileId);
        if(!profile) throw new ElementNotFound('This profile doesn`t exists');

        await this.repository.update('profile', profileId, profileUpdate); 

        let updatedProfile =  await this.repository.get<ProfileJsonDocument>('profile', profileId);
        return updatedProfile;
    }

    public async listProfiles(): Promise<Array<ProfileJsonDocument>>{
        return await this.repository.list('profile');
    }

    public async getProfile(profileId: string): Promise<ProfileJsonDocument> {
        let validId = UuidValueObject.validateID(profileId);
        if(!validId) throw new InvalidID('The given id has an incorrect format');

        return await this.repository.get('profile', profileId)
    }
}