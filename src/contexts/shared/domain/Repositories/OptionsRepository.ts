/**
 * Type that define the options on a consult to the database
 */
export type ConsulterOptions = {
	/** Limit of the records */
	limit?: string;
	/** Page of the records to consult */
	page?: string;
	/** Columns or fields of the table or entity to get in the consult */
	fields?: string;
	/** Order of the array of records */
	order?: string;
	/** Field that work as key on the consult to order the records */
	orderField?: string;
	/** Object that contain the conditions of the consult */
	where?: any;
	/** Array of models relationed to the principal etity that are wanted on the consult*/
	include?: IncludeOptions[];
};

/**
 * Type to define the Include objects of the query
 */
export type IncludeOptions = {
	/** Name of the table to join */
	name?: string;
	/** Fields to join */
	fields?: string[];
	/** Join conditionals  */
	where?: any;
};
