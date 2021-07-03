//Libraries
import { ConsulterOptions } from '../../../domain/Repositories/OptionsRepository';
import { Query } from '../../../domain/Repositories/Query';
import { QueryMaker } from '../../../domain/Repositories/QueryMaker';
//Personal Imports
import { Repository } from '../../../domain/Repositories/Repository';
import { RepositoryConnection } from '../../../domain/Repositories/RepositoryConnection';
import { Entity } from '../../../domain/Types/Entity';
import { JsonDocument } from '../../../domain/Types/JsonDocument';
import { Constructor, Nulleable } from '../../../domain/Types/Nulleable';
import { MongoDBDataMapper } from './MongoDBDataMapper';
//Own context
import { MongoDBQueryMaker } from './MongoDBQueryMaker';

/**
 * Implement of the repository interface to MongoDB databases
 */
export class MongoDBRepository<T extends Entity, D extends JsonDocument> implements Repository<T, D> {
	protected query: QueryMaker<T, D>;
	protected mapper: MongoDBDataMapper<T, D>;
	public Model: Constructor<T>;
	constructor(protected db: RepositoryConnection, model: Constructor<T>) {
		this.Model = model;
		this.query = new MongoDBQueryMaker<T, D>(model);
		this.mapper = new MongoDBDataMapper<T, D>(model);
	}
	protected get modelName(): string {
		return this.Model?.name.toLowerCase() || '';
	}

	public async list(options: ConsulterOptions): Promise<Array<T>> {
		let { conditional, limit, orderField, order, offset, fields } = this.query.findMany(options);
		console.log(conditional);
		let data: Array<D> = await this.db
			.getConnection(this.modelName)
			.find(conditional, { fields })
			.skip(offset)
			.limit(limit)
			.sort({ [`${orderField}`]: order })
			.toArray();
		return this.mapper.mapArray(data);
	}

	public async get(id: number | string, options?: ConsulterOptions): Promise<Nulleable<T>> {
		let { conditional, fields } = this.query.findOne(id, options);
		let data: D = (await this.db.getConnection(this.modelName).find(conditional, fields).limit(1).toArray()).shift();
		return this.mapper.mapObject(data);
	}
	public async count(options?: ConsulterOptions): Promise<number> {
		let { conditional } = this.query.count(options);
		let count = await this.db.getConnection(this.modelName).find(conditional).count();
		return count;
	}

	public async insert(data: D): Promise<any> {
		let result = await this.db.getConnection(this.modelName).insertOne(data);
		return result;
	}

	public async update(id: string, data: D): Promise<any> {
		let result = await this.db.getConnection(this.modelName).updateOne({ _id: id }, { $set: data });
		return result;
	}

	public async remove(id: string): Promise<any> {
		let result = await this.db.getConnection(this.modelName).deleteOne({ _id: id });
		return result;
	}

	public async execute(query: Query): Promise<Array<any>> {
		let data = await this.db.getConnection(this.modelName).aggregate(query).toArray();
		return this.mapper.mapArray(data);
	}

	public async exists(id: string): Promise<boolean> {
		let result = await this.db.getConnection(this.modelName).indexExists(id);
		return result;
	}
}
