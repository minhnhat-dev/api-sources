const CreateError = require("http-errors");
const _ = require("lodash");
const { Conversations, Users } = require("../datasources/mongodb/models");
const { STATUS: CONVERSATION_STATUS, ERROR_CODES } = require("../constants/conversations.constant");

async function validateCreateMessage(body) {
    const {
        conversationId = "",
        sender,
        receiver
    } = body;
    /* validate conversation */
    let newConversationId = conversationId;
    if (!conversationId) {
        const dataConversation = {
            members: [
                sender,
                receiver
            ]
        };
        const newConversation = await Conversations.create(dataConversation);
        newConversationId = newConversation._id;
    } else {
        const conversationFound = await Conversations
            .findOne({
                _id: conversationId,
                status: CONVERSATION_STATUS.ACTIVE
            })
            .select("_id status members")
            .lean();

        if (!conversationFound) {
            throw new CreateError.NotFound(ERROR_CODES.CONVERSATION_NOT_FOUND);
        }
    }

    const newBody = {
        ...body,
        conversation: newConversationId
    };

    return newBody;
}

module.exports = {
    validateCreateMessage
};
