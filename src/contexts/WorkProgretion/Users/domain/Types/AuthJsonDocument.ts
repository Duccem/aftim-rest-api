import { UserJsonDocument } from "./UserJsonDocument";
export type AuthJsonDocument = {
	token: string,
	user: UserJsonDocument,
};