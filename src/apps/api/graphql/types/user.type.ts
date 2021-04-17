import { Field, ObjectType, ID, Int, Float, InputType } from 'type-graphql'

@ObjectType({description: 'Entity representing the principal user of the system'})

export class User {
	@Field( type => ID, { nullable: true, description: 'User Identification database' } ) _id?: string;
	@Field({nullable: true, description: 'Firstnames of the person'}) firstname?: string;
	@Field({nullable: true, description: 'Lastnames and mother name of the person'}) lastname?: string;
	@Field({nullable: true, description: 'User nickname to login and navigate'}) username?: string;
	@Field({nullable: true, description: 'Contact email'}) email?: string;
	@Field({nullable: true, description: 'Birthdate of the person'}) birthdate?: string;
	@Field({nullable: true, description: 'Oriented sex of the person'}) sex?: string;
	@Field(type => Int, {nullable: true, description: 'Legal age of the user'}) age?: number;
	@Field({nullable: true, description: 'Address information'}) address?: string;
	@Field({nullable: true, description: 'Avatar URL'}) photo?: string;
	@Field(type => Float, {nullable: true, description: 'Money on the virtual wallet'}) money?: number;
	@Field(type => Int, {nullable: true, description: 'Total of travels'}) travels?: number;
	@Field(type => Int, {nullable: true, description: 'Daily travels average'}) daily_travesl?: number;
	@Field(type => Float, {nullable: true, description: 'Daily spend average'}) daily_spend?: number;
	@Field({nullable: true}) token?: string;
}

@InputType()
export class UserInput{
	@Field({nullable: false, description: 'Firstnames of the person'}) firstname?: string;
	@Field({nullable: false, description: 'Lastnames and mother name of the person'}) lastname?: string;
	@Field({nullable: false, description: 'User nickname to login and navigate'}) username?: string;
	@Field({nullable: false, description: 'Security password'}) password?: string;
	@Field({nullable: false, description: 'Contact email'}) email?: string;
	@Field({nullable: true, description: 'Birthdate of the person'}) birthdate?: string;
	@Field({nullable: true, description: 'Oriented sex of the person'}) sex?: string;
	@Field({nullable: true, description: 'Address information'}) address?: string;
	@Field({nullable: true, description: 'Avatar URL'}) photo?: string;
}