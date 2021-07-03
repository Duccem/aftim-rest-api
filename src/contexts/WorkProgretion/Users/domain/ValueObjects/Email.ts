import { InvalidArgument } from '../../../../shared/domain/Http/Errors';
import { StringValueObject } from '../../../../shared/domain/ValueObjects/StringValueObject';

export class Email extends StringValueObject {
	constructor(value: string) {
		super(value);
		//this.validate();
	}

	private validate(): void {
		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3,4})+$/.test(this.value)) return;
		else throw new InvalidArgument('El email no tiene el formato correcto');
	}
}
