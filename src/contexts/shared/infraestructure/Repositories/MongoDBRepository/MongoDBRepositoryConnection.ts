import { createNamespace, getNamespace } from 'continuation-local-storage';
import { NextFunction, Request, Response } from 'express';
import { Collection, MongoClient } from 'mongodb';
import { GeneralError } from '../../../domain/Http/Errors';
import { MultiTenantRepositoryConnection, RepositoryConnection } from '../../../domain/Repositories/RepositoryConnection';
import { DatabaseOptions } from '../../../domain/Types/DatabaseOptions';
import { Logger } from '../../Logger';

export class MongoDBRepositoryConnection implements RepositoryConnection {
	protected connection?: MongoClient;
	protected database: DatabaseOptions;
	protected logger: Logger;

	constructor(database: DatabaseOptions, logger?: Logger) {
		this.database = database;
		this.logger = logger || new Logger();
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
	public getConnection(dbName: string): Collection {
		if (this.connection) {
			let collection = this.connection.db(this.database.database).collection(dbName);
			return collection;
		}
		throw new GeneralError('Not connection to database');
	}
}

export class MongoDBMultiTenantRepositoryConnection
	extends MongoDBRepositoryConnection
	implements MultiTenantRepositoryConnection
{
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

	public getConnection(dbName: string): Collection {
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
