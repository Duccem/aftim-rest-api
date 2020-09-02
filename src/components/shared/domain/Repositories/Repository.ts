import { Request, Response, NextFunction } from "express";
import { ConsulterOptions } from "./OptionsRepository";
import { JsonDocument } from "components/shared/domain/Types/JsonDocument";
import { Nulleable } from "components/shared/domain/Types/Nulleable";

/**
 * Interface of a Consulter type class that allow to consult and execute queries on a database
 * This queries can be made by any dialect of database engine
 */
export interface Repository {
	/**
	 * Method to register one connection if hasn't been registed and return the connection
	 * @param tenant Identifier of the tenant database to attack
	 * @returns The connection Pool to the tenant database
	 */
	setConnection(tenant?: string): any;
	/**
	 * Method thar return a list of records of the target table
	 * @param model The name of the target table
	 * @param options The options of the consult
	 * @returns Ana array of records, in relation to the model of the table
	 */
	list<T extends JsonDocument>(model: string, options?: ConsulterOptions): Promise<Array<T>>;

	/**
	 * Method that return an record of one regist on a target table
	 * @param model Target table name
	 * @param id Identifier of the regist
	 * @param options The options of the consult
	 * @returns An record, in relation to the model of the table
	 */
	get<T extends JsonDocument>(model: string, id: number | string, options?: ConsulterOptions): Promise<Nulleable<T>>;

	/**
	 * Method that allow to insert a new record on a table
	 * @param model Target table name
	 * @param data The data to save
	 * @returns A payload with information of the transaction
	 */
	insert(model: string, data: any): Promise<any>;

	/**
	 * Method to update the data of one record on a table
	 * @param model Target table name
	 * @param id Identifier of the record
	 * @param data Data to save
	 * @returns A payload with information of the transaction
	 */
	update(model: string, id: number | string, data: any): Promise<any>;

	/**
	 * Method to delete an record of the table
	 * @param model Target table name
	 * @param id Identifier of the record
	 * @returns A peyload with information of the transaction
	 */
	remove(model: string, id: number | string): Promise<any>;

	/**
	 * Method that allow to make a custom query
	 * @param sql Custom query
	 * @returns An array of results in relation with the query
	 */
	execute(sql: string): Promise<Array<any>>;

	/**
	 * Methd that count the number of records on a table
	 * @param model Target table name
	 * @param options The options of the consult
	 * @returns The number of records
	 */
	count(model: string, options?: ConsulterOptions): Promise<number>;
}

/**
 * Interface of a Consulter class that allow to make queries and transactions on a multi tenant architecture database system
 * The classes based on this interface has as objective the handling of the diferents connections and databases
 */
export interface MultiTenantRepository extends Repository {
	
	/**
	 * Middleware to get the tenantId of the request
	 * @param req Request Object
	 * @param _res Response Object
	 * @param next Next Function
	 */
	resolveTenant(req: Request, _res: Response, next: NextFunction): void;
}
