const { model } = require('mongoose')
const { SchemaDefaults } = require("../dbUtils")


const ProductSchema = SchemaDefaults({
    name: String,
    image: String,
    description: String,
    price: Number,
    quantity: Number,
})

const ProductModel = model('Product', ProductSchema)

module.exports = {
    ProductSchema,
    ProductModel
}