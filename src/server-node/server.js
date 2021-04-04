const express = require('express')
const app = express()
const { ApolloServer } = require('apollo-server-express')
const cors = require('cors')
const { port, CORS } = require('./src/config.json')
const schema = require('./src/graphql/schema')
const resolvers = require('./src/graphql/resolvers')
const context = require('./src/graphql/context')
const logger = require('./src/graphql/logger')
const jwt = require('express-jwt')
const { JWT } = require('./src/config.json')
const { graphqlUploadExpress } = require('graphql-upload')
const globalErrorHandler = require('./src/globalErrorHandler')

// inits
require('./src/db/dbInit')

// server configs
app.use('/static', express.static('public'))
app.use(cors(CORS));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(graphqlUploadExpress({ maxFileSize: 1000000000, maxFiles: 10 }));
app.use(jwt({
    secret: JWT.Secret, 
    audience: JWT.Audience, 
    issuer: JWT.Issuer, 
    algorithms: ['HS256'],
    getToken: (req) => req.headers['x-access-token'],
    credentialsRequired: false,
}))

// routes
app.get('/', (req, res) => res.json('DigiShop API'));

const server = new ApolloServer({
    uploads: false,
    typeDefs: schema,
    resolvers,
    context,
    plugins: [
        logger
    ],
})

server.applyMiddleware({ app, path: '/graphql' });

app.use(globalErrorHandler)

app.listen({ port }, () => {
    console.log(`DigiShop listening at http://localhost:${port}`)
})