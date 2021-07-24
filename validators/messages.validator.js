const CreateError = require("http-errors");
const _ = require("lodash");
const { Conversations, Users } = require("../datasources/mongodb/models");
const { ERROR_CODES, TYPES, STATUS } = require("../constants/messages.constant");
const { STATUS: CONVERSATION_STATUS } = require("../constants/conversations.constant");
const { validateUser } = require("./users.validator");

async function validateCreateMessage(body) {
    const {
        conversationId,
        sender
    } = body;
    /* validate conversation */
    const conversation = await Conversations
        .findOne({
            _id: conversationId,
            status: CONVERSATION_STATUS.ACTIVE
        })
        .select("_id status members")
        .lean();

    if (!conversation) {
        const errorNotFound = new CreateError.BadRequest(ERROR_CODES.CONVERSATION_NOT_FOUND);
        errorNotFound.data = { conversationId };
        throw errorNotFound;
    }

    /* validate user */
    const user = await Users
        .findOne({ _id: sender })
        .select("_id")
        .lean();

    if (!user) {
        const errorNotFound = new CreateError.BadRequest(ERROR_CODES.SENDER_NOT_FOUND);
        errorNotFound.data = { sender };
        throw errorNotFound;
    }
    /* validate is members */
    const { members = [] } = conversation;
    const isMembers = !!members.find((member) => member.toString() === sender.toString());

    if (!isMembers) {
        const errorNotMember = new CreateError.BadRequest(ERROR_CODES.SENDER_INVALID);
        errorNotMember.data = { sender };
        throw errorNotMember;
    }

    return body;
}

module.exports = {
    validateCreateMessage
};
