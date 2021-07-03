import jwt from 'jsonwebtoken';
import { set } from 'lodash';
import { Forbidden, Unauthorized } from '../../../shared/domain/Http/Errors';
import { Auth } from '../domain/Interfaces/Auth';
import { UserJsonDocument } from '../domain/Types/UserJsonDocument';

export class JWTAuth implements Auth {
	private secretKey: string;
	constructor(secret: string) {
		this.secretKey = secret;
	}
	public formatResponse(user: UserJsonDocument): UserJsonDocument {
		const userCodifiedToken = <UserJsonDocument>{};
		set(userCodifiedToken, 'profiles', user.administrativeData?.profiles);
		set(userCodifiedToken, '_id', user._id);
		set(userCodifiedToken, 'administrativeData', user.administrativeData);
		let token = jwt.sign(userCodifiedToken, this.secretKey, { expiresIn: 60 * 60 * 24 });
		user.token = token;
		return user;
	}

	public verifyToken(token: string): UserJsonDocument {
		try {
			let userCodifiedToken: any = jwt.verify(token, this.secretKey);
			return userCodifiedToken;
		} catch (error) {
			if (error instanceof jwt.TokenExpiredError) throw new Unauthorized('Token is expired', 401);
			throw new Forbidden('Token is Invalid', 403);
		}
	}
}
