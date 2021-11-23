const STATUS = {
    INACTIVE: 0,
    ACTIVE: 1
};

const ERROR_CODES = {
    ERROR_POST_NOT_FOUND: "error_post_not_found",
    ERROR_POST_INVALID: "error_post_invalid",
    ERROR_YOU_ALREADY_LIKE_POST: "error_you_already_like_post",
    ERROR_YOU_NOT_LIKE_POST_YET: "error_you_not_like_post_yet",
    ERROR_YOU_NOT_LIKE_COMMENT_YET: "error_you_not_like_comment_yet",
    ERROR_COMMENT_NOT_FOUND: "error_comment_not_found",
    ERROR_YOU_ALREADY_LIKE_COMMENT_YET: "error_you_already_like_comment_yet"
};

const VISIBLE = {
    PUBLID: 1,
    FRIENDS: 2,
    PRIVATE: 3,
    BEST_FRIENDS: 4
};

module.exports = {
    STATUS,
    ERROR_CODES,
    VISIBLE
};
