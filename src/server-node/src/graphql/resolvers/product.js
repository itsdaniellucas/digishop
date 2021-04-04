const { getProducts, getProduct, addProduct, removeProduct, modifyProduct, addStock } = require('../../services/productService')

const resolver = {
    Query: {
        products: (_, { pagination }) => getProducts(pagination),
        product: (_, { id }) => getProduct(id),
    },
    Mutation: {
        addProduct: (_, { product }, { user }) => addProduct(product, user),
        removeProduct: (_, { id }, { user }) => removeProduct(id, user),
        modifyProduct: (_, { id, product }, { user }) => modifyProduct(id, product, user),
        addStock: (_, { id, quantity }, { user }) => addStock(id, quantity, user),
    }
}

module.exports = resolver