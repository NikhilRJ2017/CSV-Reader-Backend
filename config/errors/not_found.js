// NotFound Error : 404
const { StatusCodes } = require('http-status-codes');
const CustomErrorClass = require('./custom_errors');
class NotFound extends CustomErrorClass{
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}

module.exports = NotFound;