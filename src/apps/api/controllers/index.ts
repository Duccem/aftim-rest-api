import { Application } from 'express';
import { useExpressServer } from 'routing-controllers';
import { AccessController } from './AccessController';

export const registerRoutes = (app: Application) => {
	useExpressServer(app, {
		routePrefix: '/api',
		controllers: [AccessController],
	});
};
