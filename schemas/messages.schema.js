const shared = require("./shared.schema");
const { STATUS, TYPES } = require("../constants/messages.constant");

const create = {
    type: "object",
    required: ["sender", "receiver", "conversationId"],
    properties: {
        conversationId: shared.mongoObjectId,
        sender: shared.mongoObjectId,
        receiver: shared.mongoObjectId,
        text: { type: "string" },
        media: { type: "array" }
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
        conversationId: shared.mongoObjectId
    }
};

module.exports = {
    create,
    update,
    getList
};
