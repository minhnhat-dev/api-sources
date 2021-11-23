const STATUS = {
    INACTIVE: 0,
    ACTIVE: 1
};
const TYPES = {
    PUBLIC: 1,
    PRIVATE: 2
};

const DEFAULT_BACKGROUND = "broad-bg-default-1";
const BROAD_LIMIT = 10;
const ERROR_CODES = {
    ERROR_NAME_ALREADY_EXISTS: "error_name_already_exists",
    ERROR_PASSWORD_CONFIRM_NOT_MATCH: "error_password_confirm_not_match",
    ERROR_EMAIL_ALREADY_EXISTS: "error_email_already_exists",
    ERROR_PHONE_ALREADY_EXISTS: "error_phone_already_exists",
    ERROR_YOU_ALREADY_FOLLOW_THIS: "error_you_already_follow_this",
    ERROR_YOU_NOT_FOLLOW_YET: "error_you_not_follow_yet",
    ERROR_PASSWORD_INVALID: "error_password_invalid",
    ERROR_YOU_NOT_FOLLOW_YOURSELF: "error_you_not_follow_yourself",
    ERROR_YOU_NOT_UNFOLLOW_YOURSELF: "error_you_not_unfollow_yourself",
    ERROR_PHONE_IS_REQUIRED: "error_phone_is_required",
    ERROR_EMAIL_IS_REQUIRED: "error_email_is_required",
    ERROR_BROAD_LIMIT: "You only create 10 broad, contact admin to open limit!"
};

module.exports = {
    STATUS,
    ERROR_CODES,
    TYPES,
    DEFAULT_BACKGROUND,
    BROAD_LIMIT
};
