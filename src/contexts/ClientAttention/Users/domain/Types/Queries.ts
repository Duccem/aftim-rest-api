import { Queries } from '@contexts/shared/domain/Repositories/QueryType';

export interface QueriesUser extends Queries {
	getDetailed: any[];
	getExtended: any[];
}
