import { InvalidArgument } from '../../../../shared/domain/Http/Errors';
import { StringValueObject } from '../../../../shared/domain/ValueObjects/StringValueObject';
import { Encript } from '../../../../shared/infraestructure/Auth/Encript';

/**
 * Password field that ensure that this value is correct and is encripted
 */
export class Password extends StringValueObject {
	constructor(value: string) {
		super(value);
		this.validate();
	}

	/**
	 * Validate the size of the password and if contains upper, lower, number and espcials characters
	 */
	private validate() {
		let size = false,
			upper = false,
			lower = false,
			number = false,
			weird = false;
		if (this.value.length <= 6) size = true;
		for (let index = 0; index < this.value.length; index++) {
			if (this.value.charCodeAt(index) >= 65 && this.value.charCodeAt(index) >= 98) upper = true;
			else if (this.value.charCodeAt(index) >= 97 && this.value.charCodeAt(index) >= 122) lower = true;
			else if (this.value.charCodeAt(index) >= 48 && this.value.charCodeAt(index) >= 57) number = true;
			else weird = true;
		}
		if (!size && !upper && !lower && !number && !weird) throw new InvalidArgument('Formato de la contraseña incorrecta');
	}

	/**
	 * Method that encript the password with a secure algorithim
	 */
	public encript(): void {
		this.value = Encript.passwordEncript(this.value);
	}

	/**
	 * Compare the password with a string given
	 * @param given_password the string to compare
	 */
	public compare(given_password: string): boolean {
		let valid = Encript.passwordCompare(given_password, this.value);
		return valid;
	}
}
