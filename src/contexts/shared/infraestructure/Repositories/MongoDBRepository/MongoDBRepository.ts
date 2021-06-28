//Libraries
import { Entity } from '@contexts/shared/domain/Entity';
import { Query } from '@contexts/shared/domain/Repositories/Query';
import { createNamespace, getNamespace } from 'continuation-local-storage';
import { NextFunction, Request, Response } from 'express';
import { Collection, MongoClient } from 'mongodb';
import { GeneralError } from '../../../domain/Http/Errors';
import { QueryMaker } from '../../../domain/Repositories/QueryMaker';
//Personal Imports
import { MultiTenantRepository, Repository } from '../../../domain/Repositories/Repository';
import { DatabaseOptions } from '../../../domain/Types/DatabaseOptions';
import { Constructor, Nulleable } from '../../../domain/Types/Nulleable';
import { ConsulterOptions } from '../../../domain/Types/OptionsRepository';
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
			this.logger.connection(`connected to database: ${this.database.host}/${this.database.database}`);
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

	public list = <T extends Entity>(Model: Constructor<T>) => {
		return async (options: ConsulterOptions): Promise<Array<T>> => {
			let { conditional, limit, orderField, order, offset, fields } = this.query.findMany(Model.name, options);
			console.log(limit, offset);
			let data: Array<any> = await this.getConnection(Model.name.toLowerCase())
				.find(conditional, { fields })
				.skip(offset)
				.limit(limit)
				.sort({ [`${orderField}`]: order })
				.toArray();
			let response: Array<T> = data.map((element: any) => new Model(element));
			return response;
		};
	};

	public get<T extends Entity>(Model: Constructor<T>) {
		return async (id: number | string, options?: ConsulterOptions): Promise<Nulleable<T>> => {
			let { conditional, fields } = this.query.findOne(Model.name.toLowerCase(), id, options);
			let data: any = (
				await this.getConnection(Model.name.toLowerCase()).find(conditional, fields).limit(1).toArray()
			).shift();
			return data ? new Model(data) : null;
		};
	}
	public count<T extends Entity>(Model: Constructor<T>) {
		return async (options?: ConsulterOptions): Promise<number> => {
			let { conditional } = this.query.count(Model.name.toLowerCase(), options);
			let count = await this.getConnection(Model.name.toLowerCase()).find(conditional).count();
			return count;
		};
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

	public async execute(model: string, query: Query): Promise<Array<any>> {
		return await this.getConnection(model).aggregate(query).toArray();
	}

	public async exists(model: string, id: string): Promise<boolean> {
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
			this.logger.connection(`connected to ${this.database.database}`);
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
				this.logger.connection(`connection closed to ${key} database`);
			}
		} catch (error) {
			throw new GeneralError('Error closing the connections');
		}
	}
}

export default (database: DatabaseOptions) => new MongoDBRepoitory(database);
