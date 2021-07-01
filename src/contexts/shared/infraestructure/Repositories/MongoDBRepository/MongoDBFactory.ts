import Container from 'typedi';
import { Entity } from '../../../domain/Entity';
import { Repository } from '../../../domain/Repositories/Repository';
import { RepositoryConnection } from '../../../domain/Repositories/RepositoryConnection';
import { RepositoryFactory } from '../../../domain/Repositories/RepositoryFactory';
import { JsonDocument } from '../../../domain/Types/JsonDocument';
import { Constructor } from '../../../domain/Types/Nulleable';
import { MongoDBRepository } from './MongoDBRepository';

export class MongoDBFactory implements RepositoryFactory {
	private repositories: { model: string; repository: Repository<any, any> }[] = [];
	create<T extends Entity, D extends JsonDocument>(Model: Constructor<T>): Repository<T, D> {
		let repo = this.repositories.find((r) => r.model == Model.name);
		if (repo) return repo.repository;

		let db = Container.get<RepositoryConnection>('Database');
		let repository = new MongoDBRepository<T, D>(db, Model);
		this.repositories.push({ model: Model.name, repository });
		return repository;
	}
}
