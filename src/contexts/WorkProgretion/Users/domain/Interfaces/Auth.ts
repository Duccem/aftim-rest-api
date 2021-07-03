import { UserJsonDocument } from '../Types/UserJsonDocument';

export interface Auth {
	formatResponse(user: UserJsonDocument): UserJsonDocument;
	verifyToken(token: string): any;
}
