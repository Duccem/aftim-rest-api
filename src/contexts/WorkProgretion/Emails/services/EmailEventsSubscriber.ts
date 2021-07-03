import { Inject, Service } from 'typedi';
import { DomainEvent, DomainEventClass } from '../../../shared/domain/DomainEvents/DomainEvent';
import { DomainEventSubscriber } from '../../../shared/domain/DomainEvents/DomainEventSubscriber';
import { UserCreatedDomainEvent } from '../../Users/domain/DomainEvents/UserCreatedDomainEvent';
import { EmailCreator } from './EmailCreator';

@Service('EmailSubscriber')
export class EmailEventsSubscriber implements DomainEventSubscriber {
	constructor(@Inject('EmailCreator') private emailSender: EmailCreator) {}

	public subscribedTo(): Array<DomainEventClass> {
		return [UserCreatedDomainEvent];
	}

	public async on(domainEvent: DomainEvent) {
		if (domainEvent instanceof UserCreatedDomainEvent) {
			await this.emailSender.sendRegisterEmail(domainEvent.toPrimitive());
		}
	}
}
