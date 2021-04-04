const { OrderModel } = require('../db/models/order') 
const { CartModel } = require('../db/models/cart')
const { ProductModel } = require('../db/models/product')
const { AssignDefaults } = require('../db/dbUtils')
const { ServiceSuccess, ServiceError } = require('../services/serviceUtils')
const { validateContext } = require('../services/userService')

async function getOrders(pagination, contextUser) {
    let validator = validateContext(contextUser);
    if(!validator.IsSuccessful) {
        return validator;
    }

    const contextUserId = contextUser._id
    const role = contextUser.role

    const take = pagination.itemsPerPage;
    const skip = (pagination.page - 1) * take;

    let query = { active: true, createdBy: contextUserId }

    if(role == 'Admin') {
        query = { active: true };
    }

    const data = await OrderModel.find(query)
                                .select('user products dateCreated createdBy')
                                .populate('user', 'username role')
                                .populate('products.product', 'name price image')
                                .skip(skip)
                                .limit(take)
                                .sort('-dateCreated')

    const count = await OrderModel.countDocuments(query)
    
    return ServiceSuccess((data || []).map(res => handleReturn(res)), Math.ceil(count / take))
}

async function getOrder(orderId, contextUser) {
    let validator = validateContext(contextUser);
    if(!validator.IsSuccessful) {
        return validator;
    }

    const contextUserId = contextUser._id
    const role = contextUser.role

    const order = await OrderModel.findById(orderId)
                                .select('user products dateCreated createdBy')
                                .populate('user', 'username role')
                                .populate('products.product', 'name price image')

    if(!order) {
        return ServiceError('Order not found')
    }

    if(role != 'Admin' && order.createdBy != contextUserId) {
        return ServiceError('Order cannot be accessed')
    }

    return ServiceSuccess(handleReturn(order));
}


async function addOrder(order, contextUser) {
    let validator = validateContext(contextUser);
    if(!validator.IsSuccessful) {
        return validator;
    }

    const contextUserId = contextUser._id;

    const model = AssignDefaults({
        user: contextUserId,
        products: order.products.map(i => AssignDefaults(i, contextUserId))
    }, contextUserId)

    const cart = await CartModel.findOne({ user: contextUserId })
                                .select('products')

    const productIds = cart.products.map(i => i.product);

    const products = await ProductModel.find({ _id: { '$in': productIds }, active: true });

    let prodMap = {}
    for(let p of products) {
        prodMap[p.id] = p;
    }

    // confirm order has no errors
    for(let op of cart.products) {
        let target = prodMap[op.product]
        if(target) {
            if(target.quantity < op.quantity) {
                return ServiceError(`Product: ${target.name} has only ${target.quantity} stocks left`)
            }
        } else {
            return ServiceError('Product not found');
        }
    }

    for(let op of cart.products) {
        let target = prodMap[op.product]
        if(target) {
            if(target.quantity >= op.quantity) {
                target.quantity -= op.quantity;
                target.dateModified = new Date();
                await target.save()
            }
        }
    }

    cart.products = [];
    cart.dateModified = new Date();

    await cart.save()
    const data = await OrderModel.create(model)
    const res = await data.populate('user', 'username role')
                            .populate('products.product', 'name price image')
                            .execPopulate()
                            
    return ServiceSuccess(handleReturn(res));                    
}

async function removeOrder(orderId, contextUser) {
    let validator = validateContext(contextUser);
    if(!validator.IsSuccessful) {
        return validator;
    }
    
    const contextUserId = contextUser._id
    const role = contextUser.role

    let query = { _id: orderId, createdBy: contextUserId }

    if(role == 'Admin') {
        query = { _id: orderId };
    }

    const order = await OrderModel.findOne(query)

    if(!order) {
        return ServiceError('Order not found')
    }

    const productIds = order.products.map(i => i.product)

    const products = await ProductModel.find({ _id: { '$in': productIds }, active: true })

    let prodMap = {}
    for(let p of products) {
        prodMap[p.id] = p;
    }

    for(let op of order.products) {
        let target = prodMap[op.product]
        if(target) {
            target.quantity += op.quantity;
            target.dateModified = new Date();
            await target.save()
        }
    }

    order.active = false;
    order.dateModified = new Date();

    const data = await order.save()
    const res = await data.populate('user', 'username role')
                            .populate('products.product', 'name price image')
                            .execPopulate()
    
    return ServiceSuccess(handleReturn(res));
}

function handleReturn(res) {
    return {
        id: res._id,
        user: res.user,
        products: res.products.map(i => ({
            id: i.id,
            productId: i.product.id,
            name: i.product.name,
            image: i.product.image,
            price: i.product.price,
            quantity: i.quantity,
        })),
        dateCreated: res.dateCreated.toString()
    }
}

module.exports = {
    getOrders,
    getOrder,
    addOrder,
    removeOrder
}