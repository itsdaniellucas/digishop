const crypto = require('crypto');
const jwt = require('jsonwebtoken')
const { JWT } = require('../config.json')
const { UserModel } = require('../db/models/user')
const { ServiceSuccess, ServiceError } = require('../services/serviceUtils')

async function getUser(userId) {

    const data = UserModel.findById(userId)
                            .select('username role')
                            
    return ServiceSuccess(data)
}

async function login({ username, password }) {
    let hash = crypto.createHash('sha256').update(password).digest('hex');

    const user = await UserModel.findOne({
                                username: username,
                                password: hash,
                                active: true,
                            })
                            .select('username role')

    if(!user) {
        return ServiceError('User not found');
    }

    const expiration = Math.floor(Date.now() / 1000) + (60 * 60);

    const token = jwt.sign({ data: user, exp: expiration }, 
                            JWT.Secret, 
                            { 
                                audience: JWT.Audience, 
                                issuer: JWT.Issuer,
                            });

    return ServiceSuccess({
        User: user,
        Token: token,
        TokenExpiration: expiration * 1000,
    });
}

function validateContext(contextUser) {
    if(!contextUser) {
        return ServiceError('Context user is null');
    }
    
    return ServiceSuccess(contextUser);
}


function validateAdminContext(contextUser) {
    let contextValid = validateContext(contextUser)
    if(!contextValid.IsSuccessful) {
        return contextValid
    }

    if(contextUser.role != 'Admin') {
        return ServiceError('Context user role is not Admin');
    }

    return ServiceSuccess(contextUser);
}

function validateUserContext(contextUser) {
    let contextValid = validateContext(contextUser)
    if(!contextValid.IsSuccessful) {
        return contextValid
    }

    if(contextUser.role != 'User') {
        return ServiceError('Context user role is not User');
    }

    return ServiceSuccess(contextUser);
}



module.exports = {
    login,
    validateAdminContext,
    validateUserContext,
    validateContext,
    getUser
}