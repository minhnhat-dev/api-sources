const createError = require("http-errors");

function errorMiddleware(error, req, res, next) {
    console.log("error", JSON.stringify(error));
    console.log("typeof error.message", typeof error.message);
    return res.status(error.status || 500).send({
        code: error.code,
        data: error.data || {},
        error: typeof error.message === "string" ? [error.message] : error.message
    });
}

module.exports = {
    errorMiddleware
};
