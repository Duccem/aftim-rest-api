//Libraries
import { Entity } from '@contexts/shared/domain/Entity';
import { Constructor } from '@contexts/shared/domain/Types/Nulleable';
import { createNamespace, getNamespace } from 'continuation-local-storage';
import { NextFunction, Request, Response } from 'express';
import { createPool, Pool } from 'mysql2/promise';
import { GeneralError } from '../../../domain/Errors/Errors';
import { QueryMaker } from '../../../domain/Repositories/QueryMaker';
//Personal imports
import { MultiTenantRepository, Repository } from '../../../domain/Repositories/Repository';
import { DatabaseOptions } from '../../../domain/Types/DatabaseOptions';
import { ConsulterOptions } from '../../../domain/Types/OptionsRepository';
import { Logger } from '../../../infraestructure/Logger';
//Own context
import { MySQLQueryMaker } from './MySQLQueryMaker';

/**
 * Implement of the Repository interface to MySQL Databases
 */
export class MySQLRepository implements Repository {
	public connection?: Pool;
	protected database: DatabaseOptions;
	protected query: QueryMaker;
	protected logger: Logger;

	constructor(database: DatabaseOptions, logger?: Logger) {
		this.database = database;
		this.logger = logger || new Logger();
		this.query = new MySQLQueryMaker();
	}

	/**
	 * Cloese all conections tu the database
	 */
	public async endConnection(): Promise<void> {
		if (this.connection) await this.connection.end();
		this.logger.info(`connection closed`);
	}

	/**
	 * Resolve the connection to use
	 */
	protected getConnection(): Pool {
		if (this.connection) {
			return this.connection;
		}
		throw new GeneralError('Not connection to database');
	}

	public async setConnection(database?: string): Promise<any> {
		if (this.connection) return this.connection;
		try {
			this.connection = createPool(this.database);
			this.logger.info(`connected to ${this.database.database}`);
		} catch (error) {
			throw new GeneralError('Error on database connection');
		}
		return this.connection;
	}

	public list = <T extends Entity>(Model: Constructor<T>) => {
		return async (options: ConsulterOptions): Promise<Array<T>> => {
			let sql = this.query.findMany(Model.name, options);
			this.logger.info(sql);
			let data: any = await this.getConnection().query(sql);
			let response = JSON.parse(JSON.stringify(data[0]));
			return response;
		};
	};

	public get = <T extends Entity>(Model: Constructor<T>) => {
		return async (id: number | string, options?: ConsulterOptions): Promise<T> => {
			let sql = this.query.findOne(Model.name, id, options);
			this.logger.info(sql);
			let data: any = await this.getConnection().query(sql);
			if (!data[0][0]) return <T>{};
			let response = JSON.parse(JSON.stringify(data[0][0]));
			return response;
		};
	};

	public async insert(model: string, data: any): Promise<any> {
		let inserted: any = await this.getConnection().query(`INSERT INTO ${model} set ?`, [data]);
		return inserted[0];
	}

	public async update(model: string, id: string | number, data: any): Promise<any> {
		let updated: any = await this.getConnection().query(`UPDATE ${model} set ? WHERE id = ?`, [data, id]);
		return updated[0];
	}

	public async remove(model: string, id: number | string): Promise<any> {
		let deleted: any = await this.getConnection().query(`DELETE FROM ${model} WHERE id = ? `, [id]);
		return deleted;
	}

	public async execute(query: any): Promise<Array<any>> {
		this.logger.info(query);
		let data: any = await this.getConnection().query(query);
		let response = JSON.parse(JSON.stringify(data[0]));
		return response;
	}

	public async count(model: string, options: ConsulterOptions): Promise<number> {
		let count: any = await this.getConnection().query(`SELECT COUNT(id) as total FROM ${model}`);
		let total = count[0][0].total;
		return parseInt(total);
	}

	public async exists(model: string, id: string): Promise<boolean> {
		console.log(model, id);
		return false;
	}
}

/**
 * Extended class that make sure your connections to diferents tenant databases
 */
export class MySQLMultiTenantRepository extends MySQLRepository implements MultiTenantRepository {
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
			con = createPool(this.database);
			this.logger.info(`connected to ${this.database.database}`);
			this.connectionPool[database] = con;
		} catch (error) {
			throw new GeneralError('Error on database connection');
		}
		return con;
	}

	protected getConnection(): any {
		const nameSpace = getNamespace('unique context');
		const con = nameSpace.get('connection');
		if (!con) {
			throw new GeneralError('Connection is not defined for any tenant database');
		}
		return con;
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
				this.logger.log(`connection closed to ${key} database`);
			}
		} catch (error) {
			throw new GeneralError('Error closing the connections');
		}
	}
}

export default (database: DatabaseOptions) => new MySQLRepository(database);
