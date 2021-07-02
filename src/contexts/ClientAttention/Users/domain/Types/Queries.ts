import { Query } from '../../../../shared/domain/Repositories/Query';

export interface QueriesUser {
	login(identifier: string): Query;
}
