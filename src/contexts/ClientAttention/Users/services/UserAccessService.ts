import { User } from '../domain/User';
import { UserCreatedDomainEvent } from '../domain/DomainEvents/UserCreatedDomainEvent';
import { BadRequest, Unauthorized } from '../../../shared/domain/Errors/Errors';
import { Repository } from '../../../shared/domain/Repositories/Repository';
import { UserJsonDocument } from '../domain/Types/UserJsonDocument';
import { EventBus } from '../../../shared/domain/DomainEvents/EventBus';
import { Auth } from '../domain/Interfaces/Auth';
import { Inject, Service } from 'typedi';

/**
 * Uses cases of authentication of users, login, signup and log outh
 */

@Service('UserAccessService')
export class UserAccessService {
	constructor(
		@Inject('Repository') private readonly repository: Repository,
		@Inject('EventBus') private readonly eventBus: EventBus,
		@Inject('Auth') private readonly auth: Auth
	) {}

	/**
	 * Sign up function
	 * @param actor The data of the new user
	 */
	public async signup(actor: UserJsonDocument): Promise<UserJsonDocument> {
		let count = await this.repository.count('user', { where: { username: actor.personalData.username } });

		if (count > 0) throw new BadRequest('The email is already in use');
		const user = new User(actor);
		user.personalData.password.encript();
		const userCreatedEvent = new UserCreatedDomainEvent({
			_id: user._id.toString(),
			email: user.personalData.email.toString(),
			username: user.personalData.username,
		});
		user.record(userCreatedEvent);
		await this.repository.insert('user', user.toPrimitives());
		await this.eventBus.publish(user.pullDomainEvents());
		return this.auth.formatResponse(user.toPrimitives());
	}

	public async login(identifier: string, password: string): Promise<UserJsonDocument> {
		const users: User[] = await this.repository.list<User>(User)({
			where: {
				or: {
					username: identifier,
					email: identifier,
				},
			},
		});
		if (!users[0]) throw new Unauthorized('User not found');
		const user = users[0];
		let valid = user.personalData.password.compare(password);

		if (!valid) throw new Unauthorized('Oops! incorrect password');

		return this.auth.formatResponse(user.toPrimitives());
	}

	public log() {
		return 'probando';
	}

	public async userPayment(data: any) {}
}
