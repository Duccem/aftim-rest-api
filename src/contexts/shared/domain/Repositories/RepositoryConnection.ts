import { NextFunction, Request, Response } from 'express';
import { Collection } from 'mongodb';

export interface RepositoryConnection {
	/**
	 * Method to register one connection if hasn't been registed and return the connection
	 * @param database Identifier of the tenant database to attack
	 * @returns The connection Pool to the tenant database
	 */
	setConnection(database?: string): any;

	/**
	 *
	 * @param dbName The name of the db or the collection
	 * @returns The conexion to the db
	 */
	getConnection(dbName: string): Collection;
}

export interface MultiTenantRepositoryConnection {
	/**
	 * Middleware to get the tenantId of the request
	 * @param req Request Object
	 * @param _res Response Object
	 * @param next Next Function
	 */
	resolveTenant(req: Request, _res: Response, next: NextFunction): void;
}
