import { EventBus } from '../../../domain/DomainEvents/EventBus';
import { DomainEventSubscriber } from '../../../domain/DomainEvents/DomainEventSubscriber';
import { DomainEvent } from '../../../domain/DomainEvents/DomainEvent';
import { InMemoryAsyncEventEmitterBus } from './InMemoryAsyncEventEmitterBus';

export class InMemoryAsyncEventBus implements EventBus {
	private bus: InMemoryAsyncEventEmitterBus;

	constructor() {
		this.bus = new InMemoryAsyncEventEmitterBus();
	}

	async publish(events: DomainEvent[]): Promise<void> {
		this.bus.publish(events);
	}

	addSubscribers(subscribers: Array<DomainEventSubscriber>) {
		this.bus.registerSubscribers(subscribers);
	}
}
