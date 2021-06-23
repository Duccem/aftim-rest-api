import { v4, validate } from 'uuid';

export class UuidValueObject {
	readonly value: string;

	constructor(value: string) {
		this.ensureIsValidUuid(value);

		this.value = value;
	}

	static random(): UuidValueObject {
		return new UuidValueObject(v4());
	}

	public static validateID(id: any): boolean {
		if (!validate(id)) return false;
		return true;
	}

	private ensureIsValidUuid(id: string): void {
		if (!validate(id)) {
			throw new Error(`<${this.constructor.name}> does not allow the value <${id}>`);
		}
	}

	toString(): string {
		return this.value;
	}
}
