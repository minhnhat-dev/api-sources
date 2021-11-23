const CreateError = require("http-errors");
const _ = require("lodash");
const { Broads } = require("../datasources/mongodb/models");
const { ERROR_CODES, BROAD_LIMIT } = require("../constants/broads.constant");

class BroadValidator {
    async validateCreateBroad(body) {
        const newBody = _.cloneDeep(body);
        const { name, userId } = newBody;
        const count = await Broads.countDocuments({ name, userId });
        if (count) throw new CreateError.BadRequest(ERROR_CODES.ERROR_NAME_ALREADY_EXISTS);
        const countBroad = await Broads.countDocuments({ userId });
        if (countBroad > BROAD_LIMIT) throw new CreateError.BadRequest(ERROR_CODES.ERROR_BROAD_LIMIT);
        return newBody;
    }

    async validateUpdateBroad(body) {
        const newBody = _.cloneDeep(body);
        const { name, userId } = newBody;

        if (name) {
            const count = await Broads.countDocuments({ name, userId });
            if (count) throw new CreateError.BadRequest(ERROR_CODES.ERROR_NAME_ALREADY_EXISTS);
        }

        return newBody;
    }
}

module.exports = new BroadValidator();
