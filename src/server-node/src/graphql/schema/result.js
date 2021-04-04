const { gql } = require('apollo-server-express')

const schema = gql`
    interface ManyResult {
        TotalPages: Int
        Error: String!
        IsSuccessful: Boolean!
    }

    interface Result {
        Error: String!
        IsSuccessful: Boolean!
    }

    input Pagination {
        itemsPerPage: Int!
        page: Int!
    }

    scalar Upload
`

module.exports = schema