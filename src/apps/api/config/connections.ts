import { Repository } from '../../../contexts/shared/domain/Repositories/Repository';
import { EventBus } from '../../../contexts/shared/domain/DomainEvents/EventBus';
import { CacheBucket } from '../../../contexts/shared/domain/Cache/CacheBucket';

import { MongoDBRepoitory } from '../../../contexts/shared/infraestructure/Repositories/MongoDBRepository/MongoDBRepository';
import { RabbitMQEventBus } from '../../../contexts/shared/infraestructure/EventBus/RabbitMQEventBus/RabbitMQEventBus';
import { RedisCacheBucket } from '../../../contexts/shared/infraestructure/Cache/RedisCacheBucket';

import { GeneralError } from '../../../contexts/shared/domain/Errors/Errors';
import { Logger } from '../../../contexts/shared/infraestructure/Logger';

import { messageQ, database, cache } from './keys';
import { InMemoryAsyncEventBus } from '../../../contexts/shared/infraestructure/EventBus/InMemoryAsyncEventBus/InMemoryAsyncEventBus';

export type Connections = {
	repository: Repository;
	eventBus: EventBus;
	cacher?: CacheBucket;
	logger: Logger;
};

export const connect = async (logger: Logger): Promise<Connections> => {
	try {
		let repository = new MongoDBRepoitory(database, logger);
		//let eventBus = new InMemoryAsyncEventBus();
		let eventBus = new RabbitMQEventBus(messageQ, logger);
		let cacher = new RedisCacheBucket(cache, logger);
		await Promise.all([repository.setConnection(), cacher.setConnection(), eventBus.setConnection()]);

		return {
			repository,
			eventBus,
			cacher,
			logger,
		};
	} catch (error) {
		console.log(error);
		throw new GeneralError('Error al establecer conexiones');
	}
};
