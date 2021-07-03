import { DomainEvent } from '../DomainEvents/DomainEvent';
import { JsonDocument } from './JsonDocument';
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
	public static toArray<T extends Entity, D extends JsonDocument>(entities: T[]): Array<D> {
		return entities.map((e) => e.toEntity());
	}
}
