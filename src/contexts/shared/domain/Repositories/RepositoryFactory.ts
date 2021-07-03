import { Entity } from '../Types/Entity';
import { JsonDocument } from '../Types/JsonDocument';
import { Constructor } from '../Types/Nulleable';
import { Repository } from './Repository';

export interface RepositoryFactory {
	create<T extends Entity, D extends JsonDocument>(Model: Constructor<T>): Repository<T, D>;
}
