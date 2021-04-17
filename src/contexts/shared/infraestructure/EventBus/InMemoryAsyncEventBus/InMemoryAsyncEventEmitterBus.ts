import { EventEmitter } from 'events';
import { DomainEvent } from '../../../domain/DomainEvents/DomainEvent';
import { DomainEventSubscriber } from '../../../domain/DomainEvents/DomainEventSubscriber';

export class InMemoryAsyncEventEmitterBus {
	private channel: EventEmitter;
	constructor() {
		this.channel = new EventEmitter();
	}

	public registerSubscribers(subscribers?: DomainEventSubscriber[]) {
		if (!subscribers) return;
		subscribers.map((subscriber) => {
			this.registerSubscriber(subscriber);
		});
	}

	private registerSubscriber(subscriber: DomainEventSubscriber) {
		subscriber.subscribedTo().map((event) => {
			this.channel.on(event.EVENT_NAME, (msg) => {
				subscriber.on(event.fromPrimitives(JSON.parse(msg ? (msg.toString() as string) : '')));
			});
		});
	}

	public publish(events: DomainEvent[]): void {
		events.map((event) => this.channel.emit(event.eventName, Buffer.from(JSON.stringify(event.toPrimitive()))));
	}
}
