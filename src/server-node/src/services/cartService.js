const { CartModel } = require('../db/models/cart') 
const { AssignDefaults } = require('../db/dbUtils')
const { ServiceSuccess, ServiceError } = require('../services/serviceUtils')
const { validateContext } = require('../services/userService')

async function getCart(contextUser) {
    let validator = validateContext(contextUser);
    if(!validator.IsSuccessful) {
        return validator;
    }

    const contextUserId = contextUser._id;

    const data = await CartModel.findOne({ user: contextUserId })
                                .select('products')
                                .populate('products.product', 'name price')

    let products = []

    if(data && data.products) {
        products = data.products;
    }

    let result = products.map(i => ({
        id: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity
    }))

    return ServiceSuccess(result);
}

async function addToCart(product, contextUser) {
    let validator = validateContext(contextUser);
    if(!validator.IsSuccessful) {
        return validator;
    }

    const contextUserId = contextUser._id;

    const cart = await CartModel.findOne({ user: contextUserId })
                                .select('products')

    if(!cart) {
        let model = AssignDefaults({
            user: contextUserId,
            products: [
                AssignDefaults(product, contextUserId)
            ]
        }, contextUserId)

        const newCart = await CartModel.create(model);

        return handleReturn(newCart, product.product)
    }

    let idx = cart.products.findIndex(i => i.product == product.product)

    if(idx != -1) {
        cart.products[idx].quantity += Math.abs(product.quantity);
    } else {
        cart.products.push(AssignDefaults(product, contextUserId))
    }

    const modifiedCart = await cart.save()

    return await handleReturn(modifiedCart, product.product)
}

async function removeFromCart(productId, contextUser) {
    let validator = validateContext(contextUser);
    if(!validator.IsSuccessful) {
        return validator;
    }

    const contextUserId = contextUser._id;

    const cart = await CartModel.findOne({ user: contextUserId })
                                .select('products')

    if(!cart) {
        return ServiceError('Cart not found');
    }

    let idx = cart.products.findIndex(i => i.product == productId)

    if(idx == -1) {
        return ServiceError('Product not found');
    }

    cart.products.splice(idx, 1);

    const modifiedCart = await cart.save()

    return await handleReturn(modifiedCart, productId)
}

async function addQuantity(productId, quantity, contextUser) {
    let validator = validateContext(contextUser);
    if(!validator.IsSuccessful) {
        return validator;
    }

    const contextUserId = contextUser._id;

    const cart = await CartModel.findOne({ user: contextUserId })
                                .select('products')

    if(!cart) {
        return ServiceError('Cart not found');
    }

    let idx = cart.products.findIndex(i => i.product == productId)

    if(idx == -1) {
        return ServiceError('Product not found');
    }

    cart.products[idx].quantity += Math.abs(quantity);

    const modifiedCart = await cart.save()

    return await handleReturn(modifiedCart, productId)
}

async function handleReturn(cart, productId) {
    const res = await cart.populate('products.product', 'name price')
                                .execPopulate()

    const target = res.products.find(i => i.product.id == productId);
    if(!target) {
        return ServiceError('Product not found');
    }

    return ServiceSuccess({
        id: target.product.id,
        name: target.product.name,
        price: target.product.price,
        quantity: target.quantity,
    });
}

module.exports = {
    getCart,
    addToCart,
    removeFromCart,
    addQuantity
}