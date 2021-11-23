const shared = require("./shared.schema");
const { VISIBLE } = require("../constants/posts.constant");

const create = {
    type: "object",
    required: ["user"],
    properties: {
        user: shared.mongoObjectId,
        content: { type: "string" },
        images: { type: "array" },
        visible: { type: "number", enum: Object.values(VISIBLE) }
    }
};

const update = {
    type: "object",
    required: ["user"],
    properties: {
        user: shared.mongoObjectId,
        content: { type: "string" },
        images: { type: "array" },
        visible: { type: "number", enum: Object.values(VISIBLE) }
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
        userId: shared.mongoObjectId
    }
};

const likePost = {
    type: "object",
    required: ["userId"],
    properties: {
        userId: shared.mongoObjectId
    }
};

const unlikePost = {
    type: "object",
    required: ["userId"],
    properties: {
        userId: shared.mongoObjectId
    }
};

const getTimeline = {
    type: "object",
    required: ["userId"],
    properties: {
        userId: shared.mongoObjectId
    }
};

const getLikesPost = {
    type: "object",
    properties: {
        skip: shared.getListSkip,
        limit: shared.getListLimit,
        isAll: { type: "boolean", default: false },
        select: { type: "string" },
        sort: { type: "string" }
    }
};

const createComment = {
    type: "object",
    required: ["userId", "content"],
    properties: {
        userId: shared.mongoObjectId,
        content: { type: "string", minLength: 1 }
    }
};

const getComments = {
    type: "object",
    properties: {
        skip: shared.getListSkip,
        limit: shared.getListLimit,
        isAll: { type: "boolean", default: false },
        select: { type: "string" },
        sort: { type: "string" },
        userId: shared.mongoObjectId
    }
};

const likeComment = {
    type: "object",
    required: ["userId", "postId", "commentId"],
    properties: {
        userId: shared.mongoObjectId,
        postId: shared.mongoObjectId,
        commentId: shared.mongoObjectId
    }
};

module.exports = {
    create,
    update,
    getList,
    likePost,
    unlikePost,
    getTimeline,
    getLikesPost,
    createComment,
    getComments,
    likeComment
};
