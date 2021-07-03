import { Inject, Service } from 'typedi';
import { RepositoryConnection } from '../../../../shared/domain/Repositories/RepositoryConnection';
import { MongoDBRepository } from '../../../../shared/infraestructure/Repositories/MongoDBRepository/MongoDBRepository';
import { UserRepository } from '../../domain/Interfaces/UserRepository';
import { UserJsonDocument } from '../../domain/Types/UserJsonDocument';
import { User } from '../../domain/User';

@Service('UserRepository')
export class UserMongoDBRepository extends MongoDBRepository<User, UserJsonDocument> implements UserRepository {
	constructor(@Inject('Database') db: RepositoryConnection) {
		super(db, User);
	}
	async addProfile(id: string, profile: string): Promise<any> {
		return {};
		this.db.getConnection(this.modelName).updateOne({ _id: id }, { $push: { 'administrativeData.profiles': profile } });
	}
}
