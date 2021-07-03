import Container from 'typedi';
import { EmailEventsSubscriber } from '../../../contexts/WorkProgretion/Emails/services/EmailEventsSubscriber';

export function register() {
	const emailEventSubscriber = Container.get(EmailEventsSubscriber);
	return emailEventSubscriber;
}
