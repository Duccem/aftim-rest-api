export default `
type User {
	_id: ID!
	firstname: String
	lastname: String
	username: String
	password: String
	email: String
	birthdate: String
	sex: String
	age: Int
	address: String
	photo: String
	money: Float
	travels: Int
	daily_travels: Int
	daily_spend: Float
}

type AuthToken {
	token: String!
	user: String
}
type Query {
	users: [User!]!
	signin(indentifactor: String!, password: String!): AuthToken!
}

`;
