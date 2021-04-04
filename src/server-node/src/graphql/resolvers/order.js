const { getOrders, getOrder, addOrder, removeOrder } = require('../../services/orderService')


const resolver = {
    Query: {
        orders: (_, { pagination }, { user }) => getOrders(pagination, user),
        order: (_, { id }, { user }) => getOrder(id, user)
    },
    Mutation: {
        addOrder: (_, { order }, { user }) => addOrder(order, user),
        removeOrder: (_, { id }, { user }) => removeOrder(id, user)
    }
}

module.exports = resolver