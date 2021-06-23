import { Application } from 'express';
import 'reflect-metadata';
import { useContainer, useExpressServer } from 'routing-controllers';
import { Container } from 'typedi';
import { AccessController } from './AccessController';

export const registerRoutes = (app: Application) => {
	useContainer(Container);
	useExpressServer(app, {
		routePrefix: '/api',
		controllers: [AccessController],
		defaultErrorHandler: false,
	});
};
