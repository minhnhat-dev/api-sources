const { SKIP_DEFAULT, LIMIT_DEFAULT } = require("../constants/global.constant");

class ResponseMiddleware {
    handlePagging(req, res, next) {
        res.sendItems = ({ items = [], total = 0 }) => res.status(200).send({
            skip: req.query.skip || SKIP_DEFAULT,
            limit: req.query.limit || LIMIT_DEFAULT,
            items,
            total
        });
        next();
    }
}

module.exports = new ResponseMiddleware();
