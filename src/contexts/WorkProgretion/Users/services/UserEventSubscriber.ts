import { DomainEventSubscriber } from '../../../shared/domain/DomainEvents/DomainEventSubscriber';
import { DomainEventClass, DomainEvent } from '../../../shared/domain/DomainEvents/DomainEvent';
import { PaymentCreatedDomainEvent } from '../../../Finnance/Pays/domain/DomainEvents/PaymentCreatedDomainEvent';
import { UserAccessService } from './UserAccessService';
import { Inject } from 'typedi';

export class UserEventsSubscriber implements DomainEventSubscriber {
	constructor(@Inject("UserAccessServie") private userAccessService: UserAccessService) {}
	public subscribedTo(): Array<DomainEventClass> {
		return [PaymentCreatedDomainEvent];
	}
	public async on(domainEvent: DomainEvent) {
		if (domainEvent instanceof PaymentCreatedDomainEvent) {
			await this.userAccessService.userPayment(domainEvent.toPrimitive());
		}
	}
}
