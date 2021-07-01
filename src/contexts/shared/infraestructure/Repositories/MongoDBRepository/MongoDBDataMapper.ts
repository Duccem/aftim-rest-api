import { Entity } from '../../../domain/Entity';
import { JsonDocument } from '../../../domain/Types/JsonDocument';
import { Constructor, Nulleable } from '../../../domain/Types/Nulleable';

export class MongoDBDataMapper<T extends Entity, D extends JsonDocument> {
	constructor(private Model: Constructor<T>) {}

	public mapArray(data: D[]): T[] {
		return data.map((d) => new this.Model(d));
	}

	public mapObject(data: D): Nulleable<T> {
		if (!data) return null;
		return new this.Model(data);
	}
}
