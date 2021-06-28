/**
 * General Response handle class
 */
export class GeneralResponse {
	public message: string;
	public code: number;
	public payload: any;

	/**
	 * Constructor
	 * @param payload the data to return
	 * @param message The message to the client
	 * @param code The code http
	 */
	constructor(payload: any, message?: string, code?: number) {
		this.payload = payload;
		this.message = message || '';
		this.code = code || 200;
	}
	public getCode(): number {
		if (this instanceof Success) return this.code || 200;
		if (this instanceof StateChanged) return this.code || 201;
		return 200;
	}
	public getMessage(): string {
		if (this instanceof Founded) return this.message || 'Element founded';
		if (this instanceof Listed) return this.message || 'Listed all elements';
		if (this instanceof Success) return this.message || 'Request success';
		if (this instanceof Created) return this.message || 'Inserted element';
		if (this instanceof Updated) return this.message || 'Element updated';
		if (this instanceof Deleted) return this.message || 'Element deleted';
		if (this instanceof StateChanged) return this.message || 'State of the application changed';
		return 'Ok';
	}
}

/**
 * Class to code 200 The Request Succeeded
 */
export class Success extends GeneralResponse {}

/**
 * Class to code 201 The request had change the application state successfully
 */
export class StateChanged extends GeneralResponse {}

//---  THE VARIATIONS OF THE REQUESTS   ---///

/**
 * Class to code 200 the entity was successful updated
 */
export class Founded extends Success {}

/**
 * Class to code 200
 */
export class Listed extends Success {}

/**
 * Class to code 201 the entity was successful updated
 */
export class Created extends StateChanged {}

/**
 * Class to code 201 the entity was successful updated
 */
export class Updated extends StateChanged {}

/**
 * Class to code 201 The element was been deleted
 */
export class Deleted extends StateChanged {}
