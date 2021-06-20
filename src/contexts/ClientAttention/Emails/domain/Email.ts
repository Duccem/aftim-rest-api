import { Entity } from '../../../shared/domain/Entity';
import { UuidValueObject } from '../../../shared/domain/ValueObjects/UuidValueObject';
import { EmailJsonDocument } from './Types/EmailJsonDocument';

export class Emails extends Entity {
	public _id: UuidValueObject;
	public subject: string;
	public content: string;
	public sender: string;
	public reciver: string;

	constructor(initObject: EmailJsonDocument) {
		super();
		this._id = initObject._id ? new UuidValueObject(initObject._id) : UuidValueObject.random();
		this.subject = initObject.subject;
		this.content = initObject.content;
		this.sender = initObject.sender;
		this.reciver = initObject.reciver;
	}

	public static registeredEmailContent(): string {
		return ``;
	}

	public toPrimitives(): EmailJsonDocument {
		return {
			_id: this._id.toString(),
			subject: this.subject,
			content: this.content,
			sender: this.sender,
			reciver: this.reciver,
		};
	}

	public toEntity(): EmailJsonDocument {
		return {
			_id: this._id.toString(),
			subject: this.subject,
			content: this.content,
			sender: this.sender,
			reciver: this.reciver,
		};
	}
}
