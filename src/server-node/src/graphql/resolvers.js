
const order = require('./resolvers/order') 
const product = require('./resolvers/product')
const user = require('./resolvers/user')
const result = require('./resolvers/result')
const cart = require('./resolvers/cart')

module.exports = [order, product, user, cart, result]