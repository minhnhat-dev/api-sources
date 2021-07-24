const createError = require("http-errors");

function errorMiddleware(error, req, res, next) {
    console.log("error", JSON.stringify(error));
    return res.status(error.status || 500).send({
        code: error.code,
        data: error.data || {},
        error: error.message
    });
}

module.exports = {
    errorMiddleware
};
