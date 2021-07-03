import { Entity } from '../../../shared/domain/Types/Entity';
import { UuidValueObject } from '../../../shared/domain/ValueObjects/UuidValueObject';
import { Policy } from './types/Policy';
import { ProfileJsonDocument } from './types/ProfileJsonDocument';

export class Profile extends Entity {
	public _id: UuidValueObject;
	public name: string;
	public role: string;
	public policies: Policy[];

	constructor(initObject: ProfileJsonDocument) {
		super();
		this._id = initObject._id ? new UuidValueObject(initObject._id) : UuidValueObject.random();
		this.name = initObject.name;
		this.role = initObject.role;
		this.policies = initObject.policies;
	}

	public toPrimitives(): ProfileJsonDocument {
		return {
			_id: this._id.toString(),
			name: this.name,
			role: this.role,
			policies: this.policies,
		};
	}

	public toEntity(): ProfileJsonDocument {
		return {
			_id: this._id.toString(),
			name: this.name,
			role: this.role,
			policies: this.policies,
		};
	}
}
