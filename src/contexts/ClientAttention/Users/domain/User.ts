import { Password } from './ValueObjects/Password';
import { UserAdministrativeData, UserConfigurationData, UserJsonDocument, UserPersonalData } from './Types/UserJsonDocument';
import { UuidValueObject } from '../../../shared/domain/ValueObjects/UuidValueObject';
import { UserBirthDate } from './ValueObjects/UserBirthDate';
import { Email } from './ValueObjects/Email';
import { Entity } from '../../../shared/domain/Entity';
//Principal class of Users
export class User extends Entity {
	public _id: UuidValueObject;
	public personalData: UserPersonalData;
	public administrativeData: UserAdministrativeData;
	public configurationData: UserConfigurationData;
	public profiles?: string[];
	constructor(initObject: UserJsonDocument) {
		super();
		this._id = initObject._id ? new UuidValueObject(initObject._id) : UuidValueObject.random();
		this.personalData = {
			username: initObject.personalData.username,
			password: new Password(initObject.personalData.password),
			firstname: initObject.personalData.firstname,
			lastname: initObject.personalData.lastname,
			email: new Email(initObject.personalData.email),
			birthdate: new UserBirthDate(initObject.personalData.birthdate),
			sex: initObject.personalData.sex,
		};
		this.configurationData = initObject.configurationData;
		this.administrativeData = initObject.administrativeData;
		this.profiles = initObject.profiles;
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

	/**
	 * * Return the new money amount when a spend is made, also recalculate the new daily spend
	 * @param cost cost or cant of the spend
	 */
	public spend(cost: number): number {
		this.administrativeData.money -= cost;
		let newDailySpend =
			(this.administrativeData.daily_spend * this.administrativeData.daily_travels + cost) /
			this.administrativeData.daily_travels;
		this.administrativeData.daily_spend = newDailySpend;
		return newDailySpend;
	}

	/**
	 * * Return the new money amount when a pay is made to the bag of the user
	 * @param pay
	 */
	public payment(pay: number): number {
		this.administrativeData.money += pay;
		return this.administrativeData.money;
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
				birthdate: this.personalData.birthdate.toString(),
				sex: this.personalData.sex,
			},
			administrativeData: this.administrativeData,
			configurationData: this.configurationData,
		};
	}
}
