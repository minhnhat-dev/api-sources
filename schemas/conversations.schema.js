const shared = require("./shared.schema");
const { STATUS, TYPES } = require("../constants/conversations.constant");

const create = {
    type: "object",
    required: ["members", "type"],
    properties: {
        type: {
            type: "number",
            enum: Object.values(TYPES)
        },
        members: {
            type: "array",
            minItems: 1,
            items: shared.mongoObjectId
        }
    }
};

const update = {
    type: "object",
    properties: {
        members: {
            type: "array",
            items: shared.mongoObjectId
        }
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
        type: { type: "number", enum: Object.values(TYPES) },
        userId: shared.mongoObjectId
    }
};

const checkExists = {
    type: "object",
    properties: {
        type: { type: "number", enum: Object.values(TYPES) },
        users: { type: "string" }
    }
};

module.exports = {
    create,
    update,
    getList,
    checkExists
};
