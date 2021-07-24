const CreateError = require("http-errors");
const _ = require("lodash");
const { Conversations, Users } = require("../datasources/mongodb/models");
const { ERROR_CODES, TYPES, STATUS } = require("../constants/conversations.constant");
const { validateUser } = require("./users.validator");

async function validateCreateConversation(body) {
    const { members = [], type } = body;
    /* validate users */
    const users = await Users
        .find({
            _id: { $in: _.uniq(members) }
        })
        .select("_id")
        .lean();

    const userIds = users.map((user) => user._id.toString());
    const usersInValid = members.filter((nember) => !userIds.includes(nember.toString()));

    if (usersInValid.length) {
        const errrorIdsInvalid = new CreateError.BadRequest(ERROR_CODES.USER_IDS_INVALID);
        errrorIdsInvalid.data = { members: usersInValid };
        throw errrorIdsInvalid;
    }

    /* validate conversation */
    if (type === TYPES.PRIVATE) {
        const conversations = await Conversations
            .find({
                status: STATUS.ACTIVE,
                members: { $in: members },
                type: TYPES.PRIVATE
            }).lean();

        if (conversations.length) {
            conversations.forEach((conversation) => {
                const { members: membersFound = [] } = conversation;
                const conditionExist = (item) => members.includes(item.toString());
                const isExist = membersFound.every(conditionExist);

                if (isExist) {
                    const errorDuplicate = new CreateError.BadRequest(ERROR_CODES.CONVERSATION_ALREADY_EXISTS);
                    errorDuplicate.data = { members };
                    throw errorDuplicate;
                }
            });
        }
    }

    if (type === TYPES.GROUP) {}

    return body;
}

async function validateConversation(id) {
    const conversation = await Conversations
        .findOne({ _id: id })
        .populate({
            path: "members",
            select: "_id name profilePicture"
        })
        .lean();
    if (!conversation) throw new CreateError.NotFound(ERROR_CODES.CONVERSATION_NOT_FOUND);
    return conversation;
}

module.exports = {
    validateCreateConversation,
    validateConversation
};
