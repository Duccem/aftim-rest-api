import dotenv from 'dotenv';
dotenv.config();

export const database = {
	database: process.env.DATABASE_NAME || '',
	user: process.env.DATABASE_USER || '',
	password: process.env.DATABASE_PASSWORD || '',
	host: process.env.DATABASE_HOST || '',
};

export const messageQ = {
	hostname: process.env.MESSAGE_Q_HOST || '',
	protocol: process.env.MESSAGE_Q_PROTOCOL || '',
	port: ((process.env.MESSAGE_Q_PORT as unknown) as number) || 5672,
};

export const cache = {
	host: process.env.CACHE_HOST || '',
	port: (process.env.CACHE_PORT as unknown) as number,
};

export const email = {
	email: process.env.EMAIL,
	password: process.env.EMAIL_PASSWORD,
	port: process.env.EMAIL_PORT,
};
export const tokenKey = process.env.TOKEN_KEY || '';
export const facebook = {
	clientID: process.env.FACEBOOK_CLIENT_ID || '',
	clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
	callbackURL: process.env.FACEBOOK_CALLBACK_URL || '',
};
export const port = process.env.PORT;
export const env = process.env.NODE_ENV;
