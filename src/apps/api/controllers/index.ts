import { Application } from 'express';
import 'reflect-metadata';
import { useContainer, useExpressServer } from 'routing-controllers';
import { Container } from 'typedi';
import { RESTErrorHandler } from '../../../contexts/shared/infraestructure/Http/RESTErrorHandler';
import { RESTResponseHandler } from '../../../contexts/shared/infraestructure/Http/RESTResponseHandler';
import { AccessController } from './AccessController';
import { ProfileController } from './ProfileController';

export const registerRoutes = (app: Application) => {
	useContainer(Container);
	useExpressServer(app, {
		routePrefix: '/api',
		controllers: [AccessController, ProfileController],
		defaultErrorHandler: false,
		middlewares: [RESTErrorHandler],
		interceptors: [RESTResponseHandler],
	});
};
