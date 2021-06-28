import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { tokenKey } from '../../../../apps/api/config/keys';
import { Unauthorized } from '../../../shared/domain/Http/Errors';
import { UuidValueObject } from '../../../shared/domain/ValueObjects/UuidValueObject';
import { UserJsonDocument } from '../domain/Types/UserJsonDocument';

const params = {
	secretOrKey: tokenKey,
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const strategy = new Strategy(params, (payload: UserJsonDocument, done) => {
	if (UuidValueObject.validateID(payload._id)) {
		return done(null, payload);
	}
	return done(new Unauthorized('Token is ausent', 401));
});

passport.use(strategy);

export const verify = passport.authenticate('jwt', { session: false });
