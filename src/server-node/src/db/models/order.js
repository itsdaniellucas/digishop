const { Schema, model } = require('mongoose')
const { SchemaDefaults } = require("../dbUtils")


const OrderSchema = SchemaDefaults({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    products: [
        SchemaDefaults({
            product: { type: Schema.Types.ObjectId, ref: 'Product' },
            quantity: Number
        })
    ]
})

const OrderModel = model('Order', OrderSchema)

module.exports = {
    OrderSchema,
    OrderModel
}