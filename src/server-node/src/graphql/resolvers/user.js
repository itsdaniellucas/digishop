
const { ServiceSuccess } = require('../../services/serviceUtils')
const { login, getUser } = require('../../services/userService')

const resolver = {
    Query: {
        user: (_, { id }) => getUser(id),
        currentUser: (_, args, { user }) => ServiceSuccess(user),
    },
    Mutation: {
        login: (_, { username, password }) => login({ username, password }),
    }
}

module.exports = resolver