const STATUS = {
    INACTIVE: 0,
    ACTIVE: 1
};

const TYPES = {
    PRIVATE: 1,
    GROUP: 3
};

const ERROR_CODES = {
    SENDER_NOT_FOUND: "Sender not found.",
    RECEIPT_NOT_FOUND: "Receipt not found.",
    POST_NOT_FOUND: "Post not found."
};

module.exports = {
    STATUS,
    TYPES,
    ERROR_CODES
};
