import { Container } from 'typedi';
import { MongoDBFactory } from '../../../contexts/shared/infraestructure/Repositories/MongoDBRepository/MongoDBFactory';
import { NodeMailerSender } from '../../../contexts/WorkProgretion/Emails/infraestructure/NodeMailerSender';
import { JWTAuth } from '../../../contexts/WorkProgretion/Users/infraestructure/JWTAuth';
import { email, tokenKey } from '../config/keys';
import { Connections } from './connections';

export function setContainer({ eventBus, cacher, logger, dbConnection }: Connections) {
	Container.set('Database', dbConnection);
	Container.set('RepositoryFactory', new MongoDBFactory());
	Container.set('EventBus', eventBus);
	Container.set('Cacher', cacher);
	Container.set('Auth', new JWTAuth(tokenKey as string));
	Container.set('EmailSender', new NodeMailerSender(email));
	Container.set('Logger', logger);
}
