const { getCart, addToCart, removeFromCart, addQuantity } = require('../../services/cartService')

const resolver = {
    Query: {
        cart: (_, args, { user }) => getCart(user),
    },
    Mutation: {
        addToCart: async (_, { product }, { user }) => {
            const res = await addToCart(product, user)
            console.log(res);
            return res;
        },
        removeFromCart: (_, { productId }, { user }) => removeFromCart(productId, user),
        addQuantity: (_, { productId, quantity }, { user }) => addQuantity(productId, quantity, user)
    }
}

module.exports = resolver