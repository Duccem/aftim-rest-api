import { QueryMaker } from "../QueryMaker";
import { ConsulterOptions } from "../OptionsRepository";

const SIMPLE_OPS = ["eq", "ne", "gt", "gte", "lt", "lte", "like", "notLike"];
const ARRAY_OPS = [ "in", "notIn"];


export class MongoDBQueryMaker implements QueryMaker {
    public findMany(table: string, options: ConsulterOptions = {}): any {
        let fields: any = {};

        if(options.fields) options.fields.forEach((field)=> fields[`${field}`]=1);

        let conditional = this.conditionalMaker(table, options.where);

        //Return the object to make the query
        return { 
            conditional, 
            limit: options.limit || 50, 
            orderField: options.orderField || '_id', 
            offset: options.page ? options.page + "00" : "0",
            order: options.order ? 1 : options.order,
            fields: fields
        }
    }

    public findOne(table: string, id: number | string, options: ConsulterOptions = {}): any {
        let fields: any = {};

        if(options.fields) options.fields.forEach((field)=> fields[`${field}`]=1);

        return {
            conditional: { _id: id },
            fields: fields
        }

    }
    public count(table: string, options: ConsulterOptions): any {
        let conditional = this.conditionalMaker(options.where);
        return {
            conditional,
        }
    }

    public parseOptions(options: any): any{
        let trueOptions: ConsulterOptions = {};
		if (options.fields) trueOptions.fields = options.fields.split(",");
		if (options.limit) trueOptions.limit = options.limit;
		if (options.order) trueOptions.order = options.order;
		if (options.orderField) trueOptions.orderField = options.orderField;
		if (options.page) trueOptions.page = options.page;
		for (const key in options) {
			if (!["fields", "limit", "order", "orderField", "page"].includes(key)) {
				trueOptions.where[key] = options[key];
			}
		}
		return trueOptions;
    }

    private conditionalMaker(table:string, where?:any): any{
        if(!where) return {};
        let $or = [];
        let $and = [];
        let conditions:any = {};

        for (const key in where.and) {
            $and.push(this.makeOperator(table, key, where.and[key]));
        }
        for (const key in where.or) {
			$or.push(this.makeOperator(table, key, where.or[key]));
		}
        
        for (const key in where) {
			if (key !== "and" && key !== "or") {
                Object.assign(conditions, this.makeOperator(table, key, where[key]))
			}
        }
        
        if ($or.length > 0) conditions.$or = $or;
        if ($and.length > 0) conditions.$and = $and;

        return conditions;
    }

    private makeOperator(table: string, name:string, value: any): any{
        //If the propery is an group object then make an another conditional expression
        if (name == "and" || name == "or") return this.conditionalMaker(table, { [name]: value });
        
        if (!name.includes('-')) return { [`${name}`]: value }

        let parts = name.split("-");
        let key = parts[1];
        let op = parts[0];
        
        //Errors handling
        if (!SIMPLE_OPS.includes(op) && !ARRAY_OPS.includes(op)) throw new Error(`El operador ${op} no es valido`)
        if (SIMPLE_OPS.includes(op) && Array.isArray(value)) throw new Error(`El operador ${op} solo admite un solo valor`);
        if (ARRAY_OPS.includes(op) && !Array.isArray(value)) throw new Error(`El operador ${op} requiere al menos 2 valores`);
        
        //Make the expression for the correspondient
        if (op == "eq") return { [`${key}`]: {$eq: value} };
        if (op == "ne") return {[`${key}`]:{$ne: value}};
        if (op == "gt") return {[`${key}`]:{$gt: value}};
        if (op == "gte") return {[`${key}`]:{$gte: value}};
        if (op == "lt") return {[`${key}`]:{$lt: value}};
        if (op == "lte") return {[`${key}`]:{$lte: value}};
        if (op == "in") return {[`${key}`]:{$in: value}}
        if (op == "notIn") return {[`${key}`]:{$nin: value}};
    }
}