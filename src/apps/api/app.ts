////ARCHIVO DE CONFIGURACION DEL SERVIDOR
//Requerimos los modulos necesarios para la app
//Libraries
import express, { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import ducentrace from 'ducentrace';
import cookieParser from 'cookie-parser';

// bootraping functions
import { connect } from './config/connections';
import { setContainer } from './config/container';
import { registerObservers } from './schema/observers/observer';
import { makeSchema } from './schema/schema';
import { env } from './config/keys';

//Shared context domain implematations
import { Logger } from '../../contexts/shared/infraestructure/Logger';
import { GraphErrorHandler } from '../../contexts/shared/infraestructure/Errors/GraphErrorHandler';

/**
 * Class of the principal application of the server
 * ```
 * const app = new App();
 * const app = new App(3000);
 * ```
 *
 */

export class App {
	public app: Application;
	public logger: Logger;
	/**
	 *
	 * @param port the number of the port where the app is started to listen
	 */
	constructor(private port?: number | string) {
		this.app = express();
		this.logger = new Logger({
			mode: env || 'dev',
			format: 'utc',
		});
		this.settings();
	}

	private settings() {
		this.app.set('port', this.port || process.argv[2] || process.env.PORT || 5000);
	}

	private middlewares() {
		this.app.use(cors({ exposedHeaders: 'Authorization' }));
		this.app.use(cookieParser());
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: false }));
		this.app.use(ducentrace());
	}

	private async intialize() {
		const connections = await connect(this.logger);
		setContainer(connections);
		registerObservers();
	}

	private async apolloServer() {
		const schema = await makeSchema();
		const server = new ApolloServer({
			schema,
			context: ({ req }) => {
				return { req };
			},
			playground: true,
			introspection: true,
			formatError: GraphErrorHandler,
		});
		server.applyMiddleware({ app: this.app, path: '/api/graph/v1' });
	}

	public async bootstrap() {
		this.middlewares();
		await this.intialize();
		await this.apolloServer();
	}

	/**
	 * Function to start the server
	 */
	public listen() {
		let server = this.app.listen(this.app.get('port'), '0.0.0.0');
		server.on('listening', async () => {
			let address: any = server.address();
			this.logger.log(`🚀 Listening on http://${address.address}:${address.port}`, { color: 'warning', type: 'server' });
		});
	}
}
