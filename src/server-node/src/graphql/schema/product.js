const { gql } = require('apollo-server-express')

const schema = gql`
    extend type Query {
        products(pagination: Pagination!): ProductManyResult
        product(id: ID!): ProductResult
    }

    extend type Mutation {
        addProduct(product: NewProduct!): ProductResult
        removeProduct(id: ID!): ProductResult
        modifyProduct(id: ID!, product: ModifyProduct!): ProductResult
        addStock(id: ID!, quantity: Int!): ProductResult
    }

    type ProductManyResult implements ManyResult {
        Data: [Product!]
        TotalPages: Int
        Error: String!
        IsSuccessful: Boolean!
    }

    type ProductResult implements Result {
        Data: Product
        Error: String!
        IsSuccessful: Boolean!
    }

    type Product {
        id: ID!
        name: String!
        image: String!
        description: String!
        quantity: Int!
        price: Float!
    }

    input NewProduct {
        name: String!
        image: Upload!
        description: String!
        quantity: Int!
        price: Float!
    }

    input ModifyProduct {
        name: String!
        description: String!
        quantity: Int!
        price: Float!
    }
`

module.exports = schema