const { v4: uuidv4 } = require('uuid')


const context = ({ req }) => {
    return {
        user: req.user ? (req.user.data || null) : null,
        reqId: uuidv4(),
    }
}

module.exports = context;