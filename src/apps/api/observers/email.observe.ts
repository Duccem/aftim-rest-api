import Container from 'typedi';
import { EmailEventsSubscriber } from '../../../contexts/ClientAttention/Emails/application/EmailEventsSubscriber';

export function register() {
	const emailEventSubscriber = Container.get(EmailEventsSubscriber);
	return emailEventSubscriber;
}
