const { gql } = require('apollo-server-express')

const schema = gql`
    extend type Query {
        cart: CartManyResult
    }

    extend type Mutation {
        addToCart(product: CartProductInput!): CartResult
        removeFromCart(productId: ID!): CartResult
        addQuantity(productId: ID!, quantity: Int!): CartResult
    }

    type CartManyResult implements Result {
        Data: [CartProduct!]
        Error: String!
        IsSuccessful: Boolean!
    }

    type CartResult implements Result {
        Data: CartProduct
        Error: String!
        IsSuccessful: Boolean!
    }

    type CartProduct {
        id: ID!
        name: String!
        quantity: Int!
        price: Float!
    }

    input CartProductInput {
        product: ID!
        quantity: Int!
    }
`

module.exports = schema