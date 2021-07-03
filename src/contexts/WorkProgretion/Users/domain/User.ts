import { Entity } from '../../../shared/domain/Types/Entity';
import { UuidValueObject } from '../../../shared/domain/ValueObjects/UuidValueObject';
import { UserAdministrativeData, UserConfigurationData, UserJsonDocument, UserPersonalData } from './Types/UserJsonDocument';
import { Email } from './ValueObjects/Email';
import { Password } from './ValueObjects/Password';
import { UserBirthDate } from './ValueObjects/UserBirthDate';
//Principal class of Users
export class User extends Entity {
	public _id: UuidValueObject;
	public personalData: UserPersonalData;
	public administrativeData?: UserAdministrativeData;
	public configurationData?: UserConfigurationData;
	constructor(initObject: UserJsonDocument) {
		super();
		this._id = initObject._id ? new UuidValueObject(initObject._id) : UuidValueObject.random();
		this.personalData = {
			username: initObject.personalData.username,
			password: new Password(initObject.personalData.password as string),
			firstname: initObject.personalData.firstname,
			lastname: initObject.personalData.lastname,
			email: new Email(initObject.personalData.email),
			birthdate: new UserBirthDate(initObject.personalData.birthdate as string),
			sex: initObject.personalData.sex,
			address: initObject.personalData.address,
			biography: initObject.personalData.biography,
		};
		this.configurationData = initObject.configurationData;
		this.administrativeData = initObject.administrativeData;
	}

	/**
	 * * Return a complete data description of the user
	 */
	public getDescription(): string {
		return (
			'The user' +
			this.personalData.firstname +
			' ' +
			this.personalData.lastname +
			' Also know as: ' +
			this.personalData.username
		);
	}

	/**
	 * Return the full name of the user
	 */
	public getFullName(): string {
		return `${this.personalData.firstname} ${this.personalData.lastname}`;
	}

	public toPrimitives(): UserJsonDocument {
		return {
			_id: this._id.toString(),
			personalData: {
				username: this.personalData.username,
				password: this.personalData.password.toString(),
				firstname: this.personalData.firstname,
				lastname: this.personalData.lastname,
				email: this.personalData.email.toString(),
				birthdate: this.personalData.birthdate.toUTC(this.configurationData?.timezone || ''),
				sex: this.personalData.sex,
				biography: this.personalData.biography,
				address: this.personalData.address,
				photo: this.personalData.photo,
			},
			administrativeData: this.administrativeData,
			configurationData: this.configurationData,
		};
	}

	public toEntity(): UserJsonDocument {
		return {
			_id: this._id.toString(),
			personalData: {
				username: this.personalData.username,
				firstname: this.personalData.firstname,
				lastname: this.personalData.lastname,
				email: this.personalData.email.toString(),
				birthdate: this.personalData.birthdate.toTimeZone(this.configurationData?.timezone || ''),
				age: this.personalData.birthdate.calculateAge(),
				sex: this.personalData.sex,
				biography: this.personalData.biography,
				address: this.personalData.address,
				photo: this.personalData.photo,
			},
			administrativeData: this.administrativeData,
			configurationData: this.configurationData,
		};
	}
}
