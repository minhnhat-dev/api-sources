const STATUS = {
    INACTIVE: 0,
    ACTIVE: 1
};

const TYPES = {
    TEXT: 1,
    LINK: 3,
    IMAGE: 5
};

const ERROR_CODES = {
    CONVERSATION_NOT_FOUND: "Conversation Not Found !",
    SENDER_NOT_FOUND: "Sender Not Found !",
    SENDER_INVALID: "Sender Not In Conversation !"
};

module.exports = {
    STATUS,
    TYPES,
    ERROR_CODES
};
