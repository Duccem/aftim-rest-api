import { Server } from 'socket.io';
import { Logger } from '../../Logger';

export class SocketIOService {
	private socket?: Server;
	private server: any;
	private logger: Logger;
	constructor(server: any, logger?: Logger) {
		this.server = server;
		this.logger = logger || new Logger();
	}
	public async setConnection() {
		this.socket = new Server(this.server);
	}
	public emitEvent(eventName: string, eventPayload: object) {
		this.socket?.emit(eventName, eventPayload);
		this.logger.info('Event emitted: ' + eventName);
	}
}
