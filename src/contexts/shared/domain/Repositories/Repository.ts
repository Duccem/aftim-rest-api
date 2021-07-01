import { Entity } from '../Entity';
import { JsonDocument } from '../Types/JsonDocument';
import { Nulleable } from '../Types/Nulleable';
import { ConsulterOptions } from '../Types/OptionsRepository';

/**
 * Interface of a Consulter type class that allow to consult and execute queries on a database
 * This queries can be made by any dialect of database engine
 */
export interface Repository<T extends Entity, D extends JsonDocument> {
	/**
	 * Method thar return a list of records of the target table
	 * @param model The name of the target table
	 * @param options The options of the consult
	 * @returns Ana array of records, in relation to the model of the table
	 */
	list(options: ConsulterOptions): Promise<Array<T>>;

	/**
	 * Method that return an record of one regist on a target table
	 * @param model Target table name
	 * @param id Identifier of the regist
	 * @param options The options of the consult
	 * @returns An record, in relation to the model of the table
	 */
	get(id: number | string, options?: ConsulterOptions): Promise<Nulleable<T>>;

	/**
	 * Method that count the number of records on a table
	 * @param model Target table name
	 * @param options The options of the consult
	 * @returns The number of records
	 */
	count(options?: ConsulterOptions): Promise<number>;

	/**
	 * Method that allow to insert a new record on a table
	 * @param model Target table name
	 * @param data The data to save
	 * @returns A payload with information of the transaction
	 */
	insert(data: D): Promise<any>;

	/**
	 * Method to update the data of one record on a table
	 * @param model Target table name
	 * @param id Identifier of the record
	 * @param data Data to save
	 * @returns A payload with information of the transaction
	 */
	update(id: number | string, data: D): Promise<any>;

	/**
	 * Method to delete an record of the table
	 * @param model Target table name
	 * @param id Identifier of the record
	 * @returns A peyload with information of the transaction
	 */
	remove(id: number | string): Promise<any>;

	/**
	 * Method that allow to make a custom query
	 * @param sql Custom query
	 * @returns An array of results in relation with the query
	 */
	execute(query: any): Promise<Array<any>>;

	/**
	 * Method tha verify if an index appears in the Database
	 */
	exists(id: string): Promise<boolean>;
}
