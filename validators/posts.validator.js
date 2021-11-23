const CreateError = require("http-errors");
const { Posts, Likes, Comments, CommentLikes } = require("../datasources/mongodb/models");
const { ERROR_CODES } = require("../constants/posts.constant");
const { validateUser } = require("./users.validator");

async function validateCreatePost(body) {
    const { user } = body;
    const isGetFollowings = false;
    await validateUser(user, isGetFollowings);
    return body;
}

async function validatePost(id) {
    const post = await Posts
        .findById(id)
        .populate({
            path: "user",
            select: "_id name profilePicture username"
        });

    if (!post) {
        throw new CreateError.NotFound(ERROR_CODES.ERROR_POST_NOT_FOUND);
    }

    return post;
}

async function validateUpdatePost(id, body) {
    const { user } = body;
    const post = await validatePost(id);

    if (post.user.toString() !== user) {
        throw new CreateError.BadRequest(ERROR_CODES.ERROR_POST_INVALID);
    }

    return body;
}

async function validateLikePost(id, body) {
    const { userId } = body;
    await validatePost(id);

    const countLike = await Likes.countDocuments({ userId, postId: id });

    if (countLike) {
        throw new CreateError.BadRequest(ERROR_CODES.ERROR_YOU_ALREADY_LIKE_POST);
    }

    return body;
}

async function validateUnLikePost(id, body) {
    const { userId } = body;
    await validatePost(id);

    const countLike = await Likes.countDocuments({ userId, postId: id });

    if (!countLike) {
        throw new CreateError.BadRequest(ERROR_CODES.ERROR_YOU_NOT_LIKE_POST_YET);
    }

    return body;
}

async function validateCreateComment(id, body) {
    const { userId } = body;
    const isGetFollowings = false;
    await validatePost(id);
    const user = await validateUser(userId, isGetFollowings);
    const newBody = { ...body };
    newBody.postId = id;
    newBody.user = user;
    return newBody;
}

async function validateComment(id) {
    const comment = await Comments.findById(id);
    if (!comment) throw new CreateError.NotFound(ERROR_CODES.ERROR_COMMENT_NOT_FOUND);
    return comment;
}

async function validateLikeComment(body) {
    const { userId, postId, commentId } = body;
    const user = await validateUser(userId, false);
    await validatePost(postId);
    await validateComment(commentId);
    /* validate like */
    const countLike = await CommentLikes.countDocuments({ commentId, userId });
    if (countLike) throw new CreateError.NotFound(ERROR_CODES.ERROR_YOU_ALREADY_LIKE_COMMENT_YET);
    const newBody = { ...body };
    newBody.user = user;
    return newBody;
}

async function validateUnLikeComment(body) {
    const { userId, postId, commentId } = body;
    const user = await validateUser(userId, false);
    await validatePost(postId);
    const countLike = await CommentLikes.countDocuments({ userId, commentId });
    if (!countLike) {
        throw new CreateError.BadRequest(ERROR_CODES.ERROR_YOU_NOT_LIKE_COMMENT_YET);
    }
    const newBody = { ...body };
    newBody.user = user;
    return newBody;
}

async function validateUpdateComment(body) {
    const { userId, commentId, postId } = body;
    const isGetFollowings = false;
    await validatePost(postId);
    await validateComment(commentId);
    const user = await validateUser(userId, isGetFollowings);
    const newBody = { ...body };
    newBody.user = user;
    return newBody;
}

module.exports = {
    validateCreatePost,
    validateUpdatePost,
    validatePost,
    validateLikePost,
    validateUnLikePost,
    validateCreateComment,
    validateComment,
    validateLikeComment,
    validateUnLikeComment,
    validateUpdateComment
};
