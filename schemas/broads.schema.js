const shared = require("./shared.schema");
const { STATUS, TYPES } = require("../constants/broads.constant");

const create = {
    type: "object",
    required: ["name", "type", "userId"],
    properties: {
        type: {
            type: "number",
            enum: Object.values(TYPES)
        },
        backgroundColor: { type: "string" },
        name: { type: "string", minLength: 3 },
        userId: shared.mongoObjectId
    }
};

const update = {
    type: "object",
    required: ["userId"],
    properties: {
        type: {
            type: "number",
            enum: Object.values(TYPES)
        },
        backgroundColor: { type: "string" },
        name: { type: "string", minLength: 3 },
        userId: shared.mongoObjectId
    }
};

const getList = {
    type: "object",
    properties: {
        skip: shared.getListSkip,
        limit: shared.getListLimit,
        isAll: { type: "boolean", default: false },
        select: { type: "string" },
        sort: { type: "string" },
        searchText: { type: "string" },
        status: { type: "number", enum: Object.values(STATUS) },
        type: { type: "number", enum: Object.values(TYPES) }
    }
};

module.exports = {
    create,
    update,
    getList
};
