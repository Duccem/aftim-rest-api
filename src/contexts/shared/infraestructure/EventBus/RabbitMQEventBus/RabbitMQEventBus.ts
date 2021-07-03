import { connect, Options } from 'amqplib';
import { DomainEvent } from '../../../domain/DomainEvents/DomainEvent';
import { DomainEventSubscriber } from '../../../domain/DomainEvents/DomainEventSubscriber';
import { EventBus } from '../../../domain/DomainEvents/EventBus';
import { Logger } from '../../Development/Logger';
import { RabbitMQEventEmitterBus } from './RabbitMQEventEmitterBus';

export class RabbitMQEventBus implements EventBus {
	private bus: RabbitMQEventEmitterBus;
	private logger: Logger;
	private messageQ: Options.Connect;
	constructor(messageQ: Options.Connect, logger?: Logger) {
		this.logger = logger || new Logger();
		this.messageQ = messageQ;
		this.bus = new RabbitMQEventEmitterBus();
	}

	public async setConnection(): Promise<any> {
		let connection = await connect(this.messageQ);
		let channel = await connection.createChannel();
		this.bus.setChannel(channel);
		this.logger.connection(
			`connected to the message queue server: ${this.messageQ.protocol}:${this.messageQ.hostname}:${this.messageQ.port}`
		);
	}

	async publish(events: DomainEvent[]): Promise<void> {
		this.bus.publish(events);
		this.logger.info(`Published this events: ${events.map((event) => event.eventName).join(' ')}`);
	}

	addSubscribers(subscribers: Array<DomainEventSubscriber>) {
		this.bus.registerSubscribers(subscribers);
	}
}
