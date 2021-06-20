import { createClient } from 'async-redis';
import { ClientOpts } from 'redis';
import { CacheBucket } from '../../domain/Cache/CacheBucket';
import { Logger } from '../Logger';

export class RedisCacheBucket implements CacheBucket {
	private connection: any;
	private logger: Logger;
	private config: ClientOpts;
	constructor(config: ClientOpts, logger?: Logger) {
		this.config = config;
		this.logger = logger || new Logger();
	}
	public async setConnection() {
		this.connection = createClient(this.config);
		this.logger.connection(`connected to the cache server: ${this.config.host}:${this.config.port}`);
	}
	public async setKey(key: string, val: string, time: number): Promise<boolean> {
		let res = await this.connection.setex(key, time, val);
		return res;
	}
	public async getKey(key: string): Promise<string> {
		return await this.connection.get(key);
	}
	public async deleteKey(keys: string[]): Promise<boolean> {
		return await this.connection.del(keys);
	}
}
