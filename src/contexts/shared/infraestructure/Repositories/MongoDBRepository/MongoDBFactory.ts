import Container from 'typedi';
import { Entity } from '../../../domain/Entity';
import { RepositoryConnection } from '../../../domain/Repositories/RepositoryConnection';
import { RepositoryFactory } from '../../../domain/Repositories/RepositoryFactory';
import { Constructor } from '../../../domain/Types/Nulleable';
import { MongoDBRepoitory } from './MongoDBRepository';

export class MongoDBFactory implements RepositoryFactory {
	create<T extends Entity>(Model: Constructor<T>) {
		let db = Container.get<RepositoryConnection>('Database');
		return new MongoDBRepoitory(db, Model);
	}
}
