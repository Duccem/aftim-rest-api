//shared imports
import { Inject, Service } from 'typedi';
import { EventBus } from '../../../shared/domain/DomainEvents/EventBus';
import { Repository } from '../../../shared/domain/Repositories/Repository';
import { EmailSendedDomainEvent } from '../domain/DomainEvents/EmailSendedDomainEvent';
//Own context imports
import { Emails } from '../domain/Email';
import { Sender } from '../domain/Sender';
import { EmailJsonDocument } from '../domain/Types/EmailJsonDocument';

@Service('EmailCreator')
export class EmailCreator {
	constructor(
		@Inject('Repository') private repoository: Repository,
		@Inject('EventBus') private bus: EventBus,
		@Inject('EmailSender') private sender: Sender
	) {}

	public async sendRegisterEmail(data: any) {
		let dataEmail: EmailJsonDocument = {
			subject: 'New user registered',
			reciver: data.email,
			sender: this.sender.sender,
			content: Emails.registeredEmailContent(),
		};

		const email = new Emails(dataEmail);
		await Promise.all([
			//this.sender.send(email.reciver, email.subject, email.content),
			this.repoository.insert('emails', email.toPrimitives()),
		]);
		const emailSendedEvent = new EmailSendedDomainEvent({
			entityId: email._id.toString(),
			email: email.reciver,
			username: data.username,
		});
		email.record(emailSendedEvent);
		await this.bus.publish(email.pullDomainEvents());
		return email.toPrimitives();
	}

	public async sendPaymentEmail(data: any) {}
}
