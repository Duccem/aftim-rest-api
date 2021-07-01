import { Server } from 'http';
import { CacheBucket } from '../../../contexts/shared/domain/Cache/CacheBucket';
import { EventBus } from '../../../contexts/shared/domain/DomainEvents/EventBus';
import { GeneralError } from '../../../contexts/shared/domain/Http/Errors';
import { RepositoryConnection } from '../../../contexts/shared/domain/Repositories/RepositoryConnection';
import { RedisCacheBucket } from '../../../contexts/shared/infraestructure/Cache/RedisCacheBucket';
import { RabbitMQEventBus } from '../../../contexts/shared/infraestructure/EventBus/RabbitMQEventBus/RabbitMQEventBus';
import { SocketIOService } from '../../../contexts/shared/infraestructure/EventBus/SocketIOEventService/SocketIOService';
import { Logger } from '../../../contexts/shared/infraestructure/Logger';
import { MongoDBRepositoryConnection } from '../../../contexts/shared/infraestructure/Repositories/MongoDBRepository/MongoDBRepositoryConnection';
import { cache, database, messageQ } from './keys';

export type Connections = {
	eventBus: EventBus;
	cacher?: CacheBucket;
	emitter: SocketIOService;
	logger: Logger;
	dbConnection: RepositoryConnection;
};

export const connect = async (server: Server, logger: Logger): Promise<Connections> => {
	try {
		let dbConnection = new MongoDBRepositoryConnection(database, logger);
		let emitter = new SocketIOService(server, logger);
		let eventBus = new RabbitMQEventBus(messageQ, logger);
		let cacher = new RedisCacheBucket(cache, logger);
		await Promise.all([
			emitter.setConnection(),
			cacher.setConnection(),
			eventBus.setConnection(),
			dbConnection.setConnection(),
		]);

		return {
			eventBus,
			emitter,
			cacher,
			logger,
			dbConnection,
		};
	} catch (error) {
		console.log(error);
		throw new GeneralError('Error al establecer conexiones');
	}
};
