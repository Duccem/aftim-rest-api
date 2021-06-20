import glob from 'glob';
import Container from 'typedi';
import { DomainEventSubscriber } from '../../../contexts/shared/domain/DomainEvents/DomainEventSubscriber';
import { EventBus } from '../../../contexts/shared/domain/DomainEvents/EventBus';

const subscribers = new Array<DomainEventSubscriber>();

export function registerObservers() {
	const routes = glob.sync(__dirname + '/**/*.observe.*');
	let bus = Container.get<EventBus>('EventBus');
	routes.map((route) => register(route));
	bus.addSubscribers(subscribers);
}

function register(routePath: string) {
	const route = require(routePath);
	const subscriber = route.register();
	subscribers.push(subscriber);
}
