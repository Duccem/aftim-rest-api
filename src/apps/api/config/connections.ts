import { Server } from 'http';
import { CacheBucket } from '../../../contexts/shared/domain/Cache/CacheBucket';
import { EventBus } from '../../../contexts/shared/domain/DomainEvents/EventBus';
import { GeneralError } from '../../../contexts/shared/domain/Errors/Errors';
import { Repository } from '../../../contexts/shared/domain/Repositories/Repository';
import { RedisCacheBucket } from '../../../contexts/shared/infraestructure/Cache/RedisCacheBucket';
import { RabbitMQEventBus } from '../../../contexts/shared/infraestructure/EventBus/RabbitMQEventBus/RabbitMQEventBus';
import { SocketIOService } from '../../../contexts/shared/infraestructure/EventBus/SocketIOEventService/SocketIOService';
import { Logger } from '../../../contexts/shared/infraestructure/Logger';
import { MongoDBRepoitory } from '../../../contexts/shared/infraestructure/Repositories/MongoDBRepository/MongoDBRepository';
import { cache, database, messageQ } from './keys';

export type Connections = {
	repository: Repository;
	eventBus: EventBus;
	cacher?: CacheBucket;
	emitter: SocketIOService;
	logger: Logger;
};

export const connect = async (server: Server, logger: Logger): Promise<Connections> => {
	try {
		let repository = new MongoDBRepoitory(database, logger);
		let emitter = new SocketIOService(server, logger);
		let eventBus = new RabbitMQEventBus(messageQ, logger);
		let cacher = new RedisCacheBucket(cache, logger);
		await Promise.all([
			repository.setConnection(),
			emitter.setConnection(),
			cacher.setConnection(),
			eventBus.setConnection(),
		]);

		return {
			repository,
			eventBus,
			emitter,
			cacher,
			logger,
		};
	} catch (error) {
		console.log(error);
		throw new GeneralError('Error al establecer conexiones');
	}
};
