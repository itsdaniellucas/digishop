const { model } = require('mongoose')
const { SchemaDefaults, AssignDefaults } = require("../dbUtils")
const crypto = require('crypto');


const UserSchema = SchemaDefaults({
    username: String,
    password: String,
    role: String,
})

const UserModel = model('User', UserSchema)

const createUser = ({ username, password, role }) => {
    let hash = crypto.createHash('sha256').update(password).digest('hex');
    let userModel = AssignDefaults({
        username: username,
        password: hash,
        role: role,
    });

    return UserModel.create(userModel).then(data => data).catch(err => { throw err });
}

const UserSeed = () => {
    return UserModel.find({}).exec().then(users => {
        if(users.length == 0) {
            createUser({
                username: 'admin',
                password: 'admin',
                role: 'Admin',
            });

            createUser({
                username: 'user',
                password: 'user',
                role: 'User',
            });
        }
    });
}


module.exports = {
    UserSchema,
    UserModel,
    UserSeed
}