import { Query } from '../../../../shared/domain/Repositories/Query';
import { QueriesUser } from '../../domain/Types/Queries';
import './UserMongoDBRepository';
export const UserQueries: QueriesUser = {
	login: (identifier: string): Query => [
		{
			$match: {
				$or: [{ 'personalData.username': identifier }, { 'personalData.email': identifier }],
			},
		},
		{
			$lookup: {
				from: 'profile',
				localField: 'administrativeData.profiles',
				foreignField: '_id',
				as: 'administrativeData.profiles',
			},
		},
	],
};
