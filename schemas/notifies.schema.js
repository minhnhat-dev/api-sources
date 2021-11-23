const shared = require("./shared.schema");
const { STATUS, TYPES } = require("../constants/messages.constant");

const createPostNotify = {
    type: "object",
    required: ["post", "sender"],
    properties: {
        post: shared.mongoObjectId,
        sender: shared.mongoObjectId,
        url: { type: "string" },
        text: { type: "string" }
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
    createPostNotify,
    update,
    getList
};
