const mongoose = require('mongoose')
const { DB } = require('../config.json')
const { UserSeed } = require('./models/user')

const options = {
    useUnifiedTopology: true, 
    useNewUrlParser: true,
    useFindAndModify: false,
    dbName: DB.Name,
};

mongoose.connect(DB.Url, options);

const connection = mongoose.connection;

connection.once("open", function() {
    UserSeed();
    console.log("MongoDB database connection established successfully");
});