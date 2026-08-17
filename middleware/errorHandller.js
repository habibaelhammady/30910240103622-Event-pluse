const AppError = require('../utiles/AppError'); 
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || (err.statusCode >= 400 && err.statusCode < 500 ? "fail" : "error");
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message|| "Something went wrong"
    })
}

module.exports = errorHandler;
