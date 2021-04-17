import "reflect-metadata";
import { buildSchema } from 'type-graphql';
import { Container } from "typedi";
import path from 'path';
import { GraphQLSchema } from "graphql";

//resolvers 
import { AccessResolver } from './resolvers/access.resolvers'
export const makeSchema = async (): Promise<GraphQLSchema> => {
	return  await buildSchema({
		resolvers: [AccessResolver],
		container: Container,
		emitSchemaFile: path.resolve(__dirname, "schema.gql")
	})
};