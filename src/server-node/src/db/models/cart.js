const { Schema, model } = require('mongoose')
const { SchemaDefaults } = require("../dbUtils")


const CartSchema = SchemaDefaults({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    products: [
        SchemaDefaults({
            product: { type: Schema.Types.ObjectId, ref: 'Product' },
            quantity: Number
        })
    ]
})

const CartModel = model('Cart', CartSchema)

module.exports = {
    CartSchema,
    CartModel
}