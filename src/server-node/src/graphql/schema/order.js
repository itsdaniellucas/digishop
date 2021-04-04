const { gql } = require('apollo-server-express')

const schema = gql`
    extend type Query {
        orders(pagination: Pagination!): OrderManyResult
        order(id: ID!): OrderResult
    }

    extend type Mutation {
        addOrder(order: NewOrder!): OrderResult
        removeOrder(id: ID!): OrderResult
    }

    type OrderManyResult implements ManyResult {
        Data: [Order!]
        TotalPages: Int
        Error: String!
        IsSuccessful: Boolean!
    }

    type OrderResult implements Result {
        Data: Order
        Error: String!
        IsSuccessful: Boolean!
    }

    type Order {
        id: ID!
        user: User!
        products: [OrderProduct!]
        dateCreated: String!
    }

    type OrderProduct {
        id: ID!
        productId: ID!
        name: String!
        image: String!
        quantity: Int!
        price: Float!
    }

    input NewOrder {
        products: [OrderProductInput!]
    }

    input OrderProductInput {
        product: ID!
        quantity: Int!
    }
`

module.exports = schema