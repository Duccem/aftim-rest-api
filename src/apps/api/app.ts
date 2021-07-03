//ARCHIVO DE CONFIGURACION DEL SERVIDOR
//Requerimos los modulos necesarios para la app
//Libraries
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import { Server } from 'http';
import passport from 'passport';
//Shared context domain implematations
import { Logger } from '../../contexts/shared/infraestructure/Development/Logger';
import ducentrace from '../../contexts/shared/infraestructure/Development/Tracer';
// bootstrapping functions
import { connect } from './config/connections';
import { setContainer } from './config/container';
import { env } from './config/keys';
import { registerRoutes } from './controllers';
import { registerObservers } from './observers/observer';

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
	public server: Server;
	public logger: Logger;
	/**
	 *
	 * @param port the number of the port where the app is started to listen
	 */
	constructor(private port?: number | string) {
		this.app = express();
		this.server = new Server(this.app);
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
		this.app.use(passport.initialize());
	}

	private async initialize() {
		const connections = await connect(this.server, this.logger);
		setContainer(connections);
		registerObservers();
		registerRoutes(this.app);
	}

	public async bootstrap() {
		this.middlewares();
		await this.initialize();
	}

	/**
	 * Function to start the server
	 */
	public listen() {
		let server = this.app.listen(this.app.get('port'), '0.0.0.0');
		server.on('listening', async () => {
			let address: any = server.address();
			this.logger.launch(`🚀 Listening on http://${address.address}:${address.port}`);
		});
	}
}
