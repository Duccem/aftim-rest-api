import { JsonDocument } from '../../../../shared/domain/Types/JsonDocument';
import { Email } from '../ValueObjects/Email';
import { Password } from '../ValueObjects/Password';
import { UserBirthDate } from '../ValueObjects/UserBirthDate';

export type UserJsonDocument = JsonDocument & {
	personalData: {
		username: string;
		password?: string;
		email: string;
		firstname: string;
		lastname: string;
		birthdate: string | Date;
		sex: string;
		age?: number;
		address?: string;
		photo?: string;
		biography?: string;
	};
	configurationData?: {
		timezone: string;
		lang: string;
		theme: string;
	};
	administrativeData?: {
		tenant?: string;
		skillTree?: string;
		profiles?: string[] | object[];
	};
	token?: string;
};

export interface UserAdministrativeData {
	tenant?: string;
	skillTree?: string;
	profiles?: string[] | object[];
}

export interface UserPersonalData {
	username: string;
	password: Password;
	email: Email;
	firstname: string;
	lastname: string;
	birthdate: UserBirthDate;
	sex: string;
	age?: number;
	address?: string;
	photo?: string;
	biography?: string;
}

export interface UserConfigurationData {
	timezone: string;
	lang: string;
	theme: string;
}
