//Libraries
import { MongoClient, Collection } from 'mongodb';
import { createNamespace, getNamespace } from 'continuation-local-storage';
import { NextFunction, Request, Response } from 'express';

//Personal Imports
import { Repository, MultiTenantRepository } from '../../../domain/Repositories/Repository';
import { QueryMaker } from '../../../domain/Repositories/QueryMaker';
import { JsonDocument } from '../../../domain/Types/JsonDocument';
import { Nulleable } from '../../../domain/Types/Nulleable';
import { DatabaseOptions } from '../../../domain/Types/DatabaseOptions';
import { ConsulterOptions } from '../../../domain/Types/OptionsRepository';
import { GeneralError } from '../../../domain/Errors/Errors';
import { Logger } from '../../../infraestructure/Logger';

//Own context
import { MongoDBQueryMaker } from './MongoDBQueryMaker';

/**
 * Implement of the repository interface to MongoDB databases
 */
export class MongoDBRepoitory implements Repository {
	protected connection?: MongoClient;
	protected logger: Logger;
	protected query: QueryMaker;
	protected database: DatabaseOptions;
	constructor(database: DatabaseOptions, logger?: Logger) {
		this.logger = logger || new Logger();
		this.query = new MongoDBQueryMaker();
		this.database = database;
	}

	public async setConnection(database?: string): Promise<any> {
		if (this.connection) return this.connection;
		try {
			this.connection = await MongoClient.connect(`${this.database.host}/${this.database.database}`, {
				useUnifiedTopology: true,
				useNewUrlParser: true,
			});
			this.logger.log(`connected to database: ${this.database.host}/${this.database.database}`, { type: 'database', color: 'success' });
		} catch (error) {
			console.log(error);
			throw new GeneralError('Error on database connection');
		}
		return this.connection;
	}
	protected getConnection(dbName: string): Collection {
		if (this.connection) {
			let collection = this.connection.db(this.database.database).collection(dbName);
			return collection;
		}
		throw new GeneralError('Not connection to database');
	}

	public async list<T extends JsonDocument>(model: string, options: ConsulterOptions): Promise<Array<T>> {
		let { conditional, limit, orderField, order, offset, fields } = this.query.findMany(model, options);
		let data: Array<T> = await this.getConnection(model)
			.find(conditional, fields)
			.skip(offset)
			.limit(limit)
			.sort({ [`${orderField}`]: order })
			.toArray();
		return data;
	}

	public async get<T extends JsonDocument>(model: string, id: string, options: ConsulterOptions): Promise<T> {
		let { conditional, fields } = this.query.findOne(model, id, options);
		let data: Array<T> = await this.getConnection(model).find(conditional, fields).limit(1).toArray();
		return data[0];
	}

	public async insert(model: string, data: any): Promise<any> {
		let result = await this.getConnection(model).insertOne(data);
		return result;
	}

	public async update(model: string, id: string, data: any): Promise<any> {
		let result = await this.getConnection(model).updateOne({ _id: id }, { $set: data });
		return result;
	}

	public async remove(model: string, id: string): Promise<any> {
		let result = await this.getConnection(model).deleteOne({ _id: id });
		return result;
	}

	public async execute(query: any): Promise<Array<any>> {
		throw new GeneralError('Este metodo no esta disponible en esta implementacion');
	}

	public async count(model: string, options: ConsulterOptions): Promise<number> {
		let { conditional } = this.query.count(model, options);
		let count = await this.getConnection(model).find(conditional).count();
		return count;
	}

	public async exists(model: string, id: string): Promise<boolean>{
		let result = await this.getConnection(model).indexExists(id);
		return result;
	}
}

/**
 * Extended class that make sure your connections to diferents tenant databases
 */
export class MongoDBMultiTenantRepository extends MongoDBRepoitory implements MultiTenantRepository {
	/** the pool of connections to the databases */
	private connectionPool: any = {};

	constructor(options: DatabaseOptions, logger?: Logger) {
		super(options, logger);
	}

	public async setConnection(database: string = 'generic'): Promise<any> {
		let con = this.connectionPool[database];
		if (con) {
			return con;
		}
		try {
			this.database.database = database;
			con = await MongoClient.connect(this.database.host);
			this.logger.log(`connected to ${this.database.database}`, { type: 'database', color: 'system' });
			this.connectionPool[database] = con;
		} catch (error) {
			throw new GeneralError('Error on database connection');
		}
		return con;
	}

	protected getConnection(dbName: string): Collection {
		const nameSpace = getNamespace('unique context');
		const con = nameSpace.get('connection');
		if (!con) {
			throw new GeneralError('Connection is not defined for any tenant database');
		}
		return con.db(this.database.database).collection(dbName);
	}

	public async resolveTenant(req: Request, _res: Response, next: NextFunction): Promise<void> {
		let nameSpace = createNamespace('unique context');
		let connection = await this.setConnection(req.tenantId);
		nameSpace.run(() => {
			nameSpace.set('connection', connection); // This will set the knex instance to the 'connection'
			next();
		});
	}

	public async endConnection(): Promise<void> {
		try {
			for (const key in this.connectionPool) {
				await this.connectionPool[key].end();
				this.logger.log(`connection closed to ${key} database`, { type: 'database', color: 'system' });
			}
		} catch (error) {
			throw new GeneralError('Error closing the connections');
		}
	}
}

export default (database: DatabaseOptions) => new MongoDBRepoitory(database);
