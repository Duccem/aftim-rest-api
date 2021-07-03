import { Repository } from '../../../../shared/domain/Repositories/Repository';
import { UserJsonDocument } from '../Types/UserJsonDocument';
import { User } from '../User';
export interface UserRepository extends Repository<User, UserJsonDocument> {
	addProfile(id: string, profile: string): Promise<any>;
}
