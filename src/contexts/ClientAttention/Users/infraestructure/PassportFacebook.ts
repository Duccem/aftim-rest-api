import passport from 'passport';
import { Strategy, StrategyOptionWithRequest } from 'passport-facebook';
import { facebook } from '../../../../apps/api/config/keys';

const params: StrategyOptionWithRequest = {
	clientID: facebook.clientID,
	clientSecret: facebook.clientSecret,
	callbackURL: facebook.clientSecret,
	profileFields: ['email', 'first_name', 'last_name', 'gender', 'birthday'],
	passReqToCallback: true,
};

const strategy = new Strategy(params, (req, accessToken, refreshToken, profile, done) => {
	const perfil = profile._json;
	const user = {
		personalData: {
			firstname: perfil.firstname,
			lastname: perfil.lastname,
			email: perfil.email,
			sex: perfil.gender,
			birthdate: perfil.birthday,
		},
	};
	return done(null, user);
});

passport.use(strategy);

export const verify = passport.authenticate('facebook', { session: false });
