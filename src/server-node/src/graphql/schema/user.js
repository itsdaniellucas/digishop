const { gql } = require('apollo-server-express')

const schema = gql`
    extend type Query {
        user(id: ID!): UserResult
        currentUser: UserResult
    }

    extend type Mutation {
        login(username: String!, password: String!): AuthUserResult
    }

    type AuthUser {
        User: User
        Token: String
        TokenExpiration: String
    }

    type User {
        id: ID!
        username: String!
        password: String!
        role: String!
    }

    type AuthUserResult implements Result {
        Data: AuthUser
        Error: String!
        IsSuccessful: Boolean!
    }

    type UserResult implements Result {
        Data: User
        Error: String!
        IsSuccessful: Boolean!
    }
`

module.exports = schema