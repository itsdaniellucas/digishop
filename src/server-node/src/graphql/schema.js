const { gql } = require('apollo-server-express')
const order = require('./schema/order')
const product = require('./schema/product')
const user = require('./schema/user')
const result = require('./schema/result')
const cart = require('./schema/cart')

const link = gql`
    type Query {
        _: Boolean
    }
 
    type Mutation {
        _: Boolean
    }
 
    type Subscription {
        _: Boolean
    }
`

module.exports = [link, order, product, user, cart, result]