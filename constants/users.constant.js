const TYPES = {
    FACEBOOK: "facebook",
    EMAIL: "email",
    PHONE: "phone",
    NORMAL: "normal"
};

const STATUS = {
    INACTIVE: 0,
    ACTIVE: 1,
    VERIFIED: 2
};

const RELATIONSHIP = {
    SINGLE: 1,
    MARRIED: 2,
    OTHER: 3
};

const ROLES = {
    ACDMIN: 1,
    USER: 2
};

const GENDER = {
    MALE: 1,
    FEMALE: 2
};

const GRAPH_FACEBOOK_URL = "https://graph.facebook.com/v8.0";

const ERROR_CODES = {
    ERROR_USER_NOT_FOUND: "error_user_not_found",
    ERROR_PASSWORD_CONFIRM_NOT_MATCH: "error_password_confirm_not_match",
    ERROR_EMAIL_ALREADY_EXISTS: "error_email_already_exists",
    ERROR_PHONE_ALREADY_EXISTS: "error_phone_already_exists",
    ERROR_YOU_ALREADY_FOLLOW_THIS: "error_you_already_follow_this",
    ERROR_YOU_NOT_FOLLOW_YET: "error_you_not_follow_yet",
    ERROR_PASSWORD_INVALID: "error_password_invalid",
    ERROR_YOU_NOT_FOLLOW_YOURSELF: "error_you_not_follow_yourself",
    ERROR_YOU_NOT_UNFOLLOW_YOURSELF: "error_you_not_unfollow_yourself",
    ERROR_PHONE_IS_REQUIRED: "error_phone_is_required",
    ERROR_EMAIL_IS_REQUIRED: "error_email_is_required"
};

module.exports = {
    TYPES,
    GRAPH_FACEBOOK_URL,
    STATUS,
    RELATIONSHIP,
    ERROR_CODES,
    ROLES,
    GENDER
};
