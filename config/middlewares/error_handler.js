const { StatusCodes } = require('http-status-codes');

// express inbuilt error handling middleware
const errorHandler = (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        message: err.message || "Something went wrong, try again"
    }

    console.log("Inside error handling :", customError);
    return res.status(customError.statusCode).json({
        message: customError.message
    });
}

module.exports = errorHandler;