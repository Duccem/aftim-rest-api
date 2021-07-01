//Libraries
import { Service } from 'typedi';
import { Entity } from '../../../domain/Entity';
import { Query } from '../../../domain/Repositories/Query';
import { QueryMaker } from '../../../domain/Repositories/QueryMaker';
//Personal Imports
import { Repository } from '../../../domain/Repositories/Repository';
import { RepositoryConnection } from '../../../domain/Repositories/RepositoryConnection';
import { JsonDocument } from '../../../domain/Types/JsonDocument';
import { Constructor, Nulleable } from '../../../domain/Types/Nulleable';
import { ConsulterOptions } from '../../../domain/Types/OptionsRepository';
//Own context
import { MongoDBQueryMaker } from './MongoDBQueryMaker';

/**
 * Implement of the repository interface to MongoDB databases
 */
@Service('Repository')
export class MongoDBRepoitory<T extends Entity, D extends JsonDocument> implements Repository<T, D> {
	protected query: QueryMaker;
	public Model: Constructor<T>;
	constructor(private db: RepositoryConnection, model: Constructor<T>) {
		this.query = new MongoDBQueryMaker();
		this.Model = model;
	}
	private get modelName(): string {
		return this.Model?.name.toLowerCase() || '';
	}

	public async list(options: ConsulterOptions): Promise<Array<T>> {
		let { conditional, limit, orderField, order, offset, fields } = this.query.findMany(this.modelName, options);
		let data: Array<any> = await this.db
			.getConnection(this.modelName)
			.find(conditional, { fields })
			.skip(offset)
			.limit(limit)
			.sort({ [`${orderField}`]: order })
			.toArray();
		return this.mapArray(data);
	}

	public async get(id: number | string, options?: ConsulterOptions): Promise<Nulleable<T>> {
		let { conditional, fields } = this.query.findOne(this.modelName, id, options);
		let data: any = (await this.db.getConnection(this.modelName).find(conditional, fields).limit(1).toArray()).shift();
		return this.mapObject(data);
	}
	public async count(options?: ConsulterOptions): Promise<number> {
		let { conditional } = this.query.count(this.modelName, options);
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
		return await this.db.getConnection(this.modelName).aggregate(query).toArray();
	}

	public async exists(id: string): Promise<boolean> {
		let result = await this.db.getConnection(this.modelName).indexExists(id);
		return result;
	}

	private mapArray(data: Array<any>): Array<T> {
		return data.map((element) => new this.Model(element));
	}

	private mapObject(data: any): Nulleable<T> {
		new this.Model(data);
		return null;
	}
}
