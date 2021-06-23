import { DomainEvent } from './DomainEvents/DomainEvent';
export abstract class Entity {
	private domainEvents: Array<DomainEvent>;

	constructor() {
		this.domainEvents = [];
	}

	public pullDomainEvents(): Array<DomainEvent> {
		return this.domainEvents;
	}

	public record(event: DomainEvent): void {
		this.domainEvents.push(event);
	}

	public abstract toPrimitives(): any;
	public abstract toEntity(): any;
	public abstract toArray(entities: Entity[]): Array<any>;
}
