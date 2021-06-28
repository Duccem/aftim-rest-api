import { isValid } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { InvalidArgument } from '../Http/Errors';

export abstract class DateValueObject {
	public value: Date;

	constructor(value: string) {
		this.validate(value);
		this.value = new Date(value);
	}

	/**
	 *
	 * * Validate the format of the date
	 */
	private validate(value: string): void {
		if (!isValid(new Date(value))) throw new InvalidArgument('The format of the date is not correct');
	}

	/**
	 * * Convert a zoned date to an utc date to standardize the dates
	 * @param tz
	 * @returns Date utc hour
	 */
	public toUTC(tz: string): Date {
		return zonedTimeToUtc(this.value, tz);
	}

	/**
	 * * Convert an UTC date to zoned date for show it to the client
	 * @param tz
	 * @returns Date zoned hour
	 */
	public toTimeZone(tz: string): Date {
		return utcToZonedTime(this.value, tz);
	}

	public toString() {
		return this.value.toISOString();
	}
}
