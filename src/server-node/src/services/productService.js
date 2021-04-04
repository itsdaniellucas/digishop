const { ProductModel } = require('../db/models/product') 
const { AssignDefaults } = require('../db/dbUtils')
const { ServiceSuccess, ServiceError } = require('../services/serviceUtils')
const { validateAdminContext } = require('../services/userService')
const path = require('path')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

async function getProducts(pagination) {
    const take = pagination.itemsPerPage;
    const skip = (pagination.page - 1) * take;

    const data = await ProductModel.find({ active: true })
                                    .select('name description image price quantity')
                                    .skip(skip)
                                    .limit(take)
                                    .sort('-dateCreated')
    const count = await ProductModel.countDocuments({ active: true })

    return ServiceSuccess(data || [], Math.ceil(count / take))
}

async function getProduct(productId) {

    const data = await ProductModel.findById(productId)
                                    .select('name description image price quantity active')

    if(!data || !data.active) {
        return ServiceError('Product not found');
    }
    
    return ServiceSuccess(data)
}


async function addProduct(product, contextUser) {
    let validator = validateAdminContext(contextUser);
    if(!validator.IsSuccessful) {
        return validator;
    }
    const contextUserId = contextUser._id

    const { createReadStream, filename } = await product.image.promise;
    
    const stream = createReadStream();
    const randomFileName = uuidv4();
    const splitName = filename.split('.');
    const ext = splitName ? splitName[1] : '.jpg';
    const fullFileName = `${randomFileName}.${ext}`;
    const urlPath = `/static/images/${fullFileName}`;
    const directory = path.join(__dirname, `../../public/images/`)
    const filePath = path.join(directory, `${fullFileName}`)

    if(!fs.existsSync(directory)) {
        await fs.mkdir(directory, { recursive: true }, _ => _);
    }

    await stream.pipe(fs.createWriteStream(filePath));

    const model = AssignDefaults({
        name: product.name,
        description: product.description,
        image: urlPath,
        quantity: product.quantity,
        price: product.price
    }, contextUserId);


    const data = await ProductModel.create(model)

    return ServiceSuccess(data)
}

async function removeProduct(productId, contextUser) {
    let validator = validateAdminContext(contextUser);
    if(!validator.IsSuccessful) {
        return validator;
    }

    const contextUserId = contextUser._id

    let model = AssignDefaults({}, contextUserId, false);
    model.active = false;

    const data = await ProductModel.findOneAndUpdate({ _id: productId, createdBy: contextUserId }, model, { new: true })

    return ServiceSuccess(data)
}

async function modifyProduct(productId, productChanges, contextUser) {
    let validator = validateAdminContext(contextUser);
    if(!validator.IsSuccessful) {
        return validator;
    }

    const contextUserId = contextUser._id

    let model = AssignDefaults(productChanges, contextUserId, false);

    const data = await ProductModel.findOneAndUpdate({ _id: productId, createdBy: contextUserId }, model, { new: true })

    return ServiceSuccess(data)
}

async function addStock(productId, quantity, contextUser) {
    let validator = validateAdminContext(contextUser);
    if(!validator.IsSuccessful) {
        return validator;
    }

    const contextUserId = contextUser._id

    const product = await ProductModel.findOne({ _id: productId, createdBy: contextUserId })

    if(!product) {
        return ServiceError('Product not found');
    }

    product.quantity += Math.abs(quantity)
    product.dateModified = new Date();
    
    const res = await product.save()

    return ServiceSuccess(res)
}

module.exports = {
    getProducts,
    getProduct,
    addProduct,
    removeProduct,
    modifyProduct,
    addStock,
}