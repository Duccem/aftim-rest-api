import { gql } from 'apollo-server-express'

const userType = `
    type Query {
        users: [User!]!
        signin(indentifactor: String!, password: String!): AuthToken!
    }
`;

export default gql(userType);