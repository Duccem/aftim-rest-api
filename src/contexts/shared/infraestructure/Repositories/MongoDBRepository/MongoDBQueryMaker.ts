import { QueryMaker } from '../../../domain/Repositories/QueryMaker';
import { ConsulterOptions } from '../../../domain/Types/OptionsRepository';

const SIMPLE_OPS = ['eq', 'ne', 'gt', 'gte', 'lt', 'lte', 'like', 'notLike'];
const ARRAY_OPS = ['in', 'notIn'];

export class MongoDBQueryMaker implements QueryMaker {
	public findMany(options: ConsulterOptions = {}): any {
		let fields: any = {};
		if (options.fields) options.fields.split(',').forEach((field) => (fields[`${field}`] = 1));
		let conditional = this.conditionalMaker(options.where);

		//Return the object to make the query
		return {
			conditional,
			limit: options.limit ? parseInt(options.limit) : 50,
			orderField: options.orderField || '_id',
			offset: options.page ? (parseInt(options.page) - 1) * parseInt(options.limit || '50') : 0,
			order: options.order ? options.order : 1,
			fields: fields,
		};
	}

	public findOne(id: number | string, options: ConsulterOptions = {}): any {
		let fields: any = {};

		if (options.fields) options.fields.split('').forEach((field) => (fields[`${field}`] = 1));

		return {
			conditional: { _id: id },
			fields: fields,
		};
	}
	public count(options?: ConsulterOptions): any {
		let conditional = this.conditionalMaker(options?.where);
		return {
			conditional,
		};
	}

	public parseOptions(options: any): any {
		let trueOptions: ConsulterOptions = {};
		if (options.fields) trueOptions.fields = options.fields.split(',');
		if (options.limit) trueOptions.limit = options.limit;
		if (options.order) trueOptions.order = options.order;
		if (options.orderField) trueOptions.orderField = options.orderField;
		if (options.page) trueOptions.page = options.page;
		for (const key in options) {
			if (!['fields', 'limit', 'order', 'orderField', 'page'].includes(key)) {
				trueOptions.where[key] = options[key];
			}
		}
		return trueOptions;
	}

	private conditionalMaker(where?: any): any {
		if (!where) return {};
		let $or = [];
		let $and = [];
		let conditions: any = {};

		for (const key in where.and) {
			$and.push(this.makeOperator(key, where.and[key]));
		}
		for (const key in where.or) {
			$or.push(this.makeOperator(key, where.or[key]));
		}

		for (const key in where) {
			if (key !== 'and' && key !== 'or') {
				Object.assign(conditions, this.makeOperator(key, where[key]));
			}
		}

		if ($or.length > 0) conditions.$or = $or;
		if ($and.length > 0) conditions.$and = $and;

		return conditions;
	}

	private makeOperator(name: string, value: any): any {
		//If the propery is an group object then make an another conditional expression
		if (name == 'and' || name == 'or') return this.conditionalMaker({ [name]: value });
		if (typeof value == 'object') return { [name]: this.conditionalMaker(value) };
		if (!SIMPLE_OPS.includes(name) && !ARRAY_OPS.includes(name)) return { [name]: value };
		//Errors handling
		//if (!SIMPLE_OPS.includes(name) && !ARRAY_OPS.includes(name)) throw new Error(`El operador ${name} no es valido`);
		if (SIMPLE_OPS.includes(name) && Array.isArray(value)) throw new Error(`El operador ${name} solo admite un solo valor`);
		if (ARRAY_OPS.includes(name) && !Array.isArray(value)) throw new Error(`El operador ${name} requiere al menos 2 valores`);

		//Make the expression for the correspondient
		if (name == 'eq') return { $eq: value };
		if (name == 'ne') return { $ne: value };
		if (name == 'gt') return { $gt: value };
		if (name == 'gte') return { $gte: value };
		if (name == 'lt') return { $lt: value };
		if (name == 'lte') return { $lte: value };
		if (name == 'in') return { $in: value };
		if (name == 'notIn') return { $nin: value };
		if (name == 'like') return { $regex: `/${value}/` };
	}
}
