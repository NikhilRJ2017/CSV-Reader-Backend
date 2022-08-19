// connecting to db
const mongoose = require('mongoose');
const connectDB = async (dbURL) => {
    return mongoose.connect(dbURL);
}

module.exports = connectDB;