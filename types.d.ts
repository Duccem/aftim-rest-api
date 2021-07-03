import { Logger } from './src/contexts/shared/infraestructure/Development/Logger';

declare global {
	namespace Express {
		export interface Request {
			userId: string;
			tenantId: string;
			file: Multer.File;
			logger: Logger;
		}
	}
}
