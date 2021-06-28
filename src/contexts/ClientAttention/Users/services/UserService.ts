import { ElementNotFound, InvalidID } from '../../../shared/domain/Http/Errors';
import { Repository } from '../../../shared/domain/Repositories/Repository';
import { ConsulterOptions } from '../../../shared/domain/Types/OptionsRepository';
import { UuidValueObject } from '../../../shared/domain/ValueObjects/UuidValueObject';
import { UserJsonDocument } from '../domain/Types/UserJsonDocument';
import { User } from '../domain/User';

export class UserCrud {
	private repository: Repository;
	constructor(repo: Repository) {
		this.repository = repo;
	}

	public async list(options: ConsulterOptions): Promise<Array<UserJsonDocument>> {
		let data = await this.repository.list<User>(User)(options);
		return data[0].toArray(data);
	}

	public async get(id: any, options: ConsulterOptions): Promise<UserJsonDocument | undefined> {
		if (!UuidValueObject.validateID(id)) throw new InvalidID(`The ID: ${id} is not valid for the User model`);

		let user = await this.repository.get<User>(User)(id, options);

		return user?.toEntity();
	}

	public async upsert(id: any, data: UserJsonDocument): Promise<UserJsonDocument> {
		if (!UuidValueObject.validateID(id)) throw new InvalidID(`The ID: ${id} is not valid for the User model`);
		if ((await this.repository.count('users', id)) <= 0) throw new ElementNotFound(`Element ${id} not found`);

		const user = new User(data);

		await this.repository.update('users', id, data);

		return data;
	}
}
