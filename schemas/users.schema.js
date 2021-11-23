const shared = require("./shared.schema");
const { RELATIONSHIP, TYPES, GENDER } = require("../constants/users.constant");

const create = {
    type: "object",
    required: [
        "username", "email", "password", "passwordConfirm"
    ],
    properties: {
        name: { type: "string" },
        username: { type: "string" },
        phone: { type: "string" },
        email: { type: "string", format: "email" },
        password: { type: "string" },
        passwordConfirm: { type: "string" },
        from: { type: "string" },
        city: { type: "string" },
        description: { type: "string" },
        gender: { type: "number", enum: Object.values(GENDER) }
    }
};

const update = {
    type: "object",
    required: [],
    properties: {
        name: { type: "string" },
        fullName: { type: "string" },
        username: { type: "string" },
        phone: { type: "string" },
        email: { type: "string", format: "email" },
        from: { type: "string" },
        city: { type: "string" },
        description: { type: "string" },
        address: { type: "string" },
        profilePicture: { type: "string" },
        coverPicture: { type: "string" },
        gender: { type: "number" },
        relationship: { type: "number", enum: Object.values(RELATIONSHIP) }
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
        ids: { type: "string" }
    }
};

const login = {
    type: "object",
    required: ["email", "password"],
    properties: {
        email: {
            type: "string",
            format: "email"
        },
        password: {
            type: "string"
        }
    }
};

const follow = {
    type: "object",
    properties: {
        userId: shared.mongoObjectId,
        followerId: shared.mongoObjectId
    }
};

const unFollow = {
    type: "object",
    properties: {
        userId: shared.mongoObjectId,
        unFollowerId: shared.mongoObjectId
    }
};

const refreshToken = {
    type: "object",
    required: ["refreshToken"],
    properties: {
        refreshToken: { type: "string" }
    }
};

const logout = {
    type: "object",
    required: ["refreshToken"],
    properties: {
        refreshToken: { type: "string" }
    }
};

const sendOtp = {
    type: "object",
    required: ["type"],
    properties: {
        email: { type: "string", format: "email" },
        phone: { type: "string" },
        type: { type: "string", enum: Object.values(TYPES) }
    }
};

const verifyOtp = {
    type: "object",
    required: ["hash", "otp", "type"],
    properties: {
        otp: { type: "string" },
        hash: { type: "string" },
        phone: { type: "string" },
        email: { type: "string", format: "email" },
        type: { type: "string", enum: Object.values(TYPES) }
    }
};

const createUserEmailPhone = {
    type: "object",
    required: [
        "type", "password", "passwordConfirm"
    ],
    properties: {
        email: { type: "string", format: "email" },
        phone: { type: "string" },
        type: { type: "string", enum: Object.values(TYPES) },
        password: { type: "string" },
        passwordConfirm: { type: "string" }
    }
};

module.exports = {
    create,
    update,
    getList,
    login,
    follow,
    unFollow,
    refreshToken,
    sendOtp,
    verifyOtp,
    createUserEmailPhone,
    logout
};
