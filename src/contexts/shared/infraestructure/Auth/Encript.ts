import bcrypt from 'bcryptjs';
import { GeneralError } from '../../domain/Http/Errors';

/**
 * Class that work as interface of comunication with the authentication microservice
 */
export class Encript {
	public static passwordEncript(password: string): string {
		try {
			let salt = bcrypt.genSaltSync(10);
			let hash = bcrypt.hashSync(password, salt);
			return hash;
		} catch (error) {
			throw new GeneralError(`Al encriptar contraseña, Error: ${error}`);
		}
	}

	public static passwordCompare(password: string, hash: string): boolean {
		try {
			let valido = bcrypt.compareSync(password, hash);
			return valido;
		} catch (error) {
			throw new GeneralError(`Al validar contraseña, Error: ${error}`);
		}
	}
}
