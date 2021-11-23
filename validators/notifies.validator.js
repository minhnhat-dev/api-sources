const CreateError = require("http-errors");
const _ = require("lodash");
const { Users, Posts, Followers } = require("../datasources/mongodb/models");
const { ERROR_CODES } = require("../constants/notifies.constant");

async function validateCreatePostNotify(body) {
    const {
        sender,
        post
    } = body;
    /* validate users */
    const countSender = await Users.countDocuments({ _id: sender });
    if (!countSender) throw new CreateError.NotFound(ERROR_CODES.SENDER_NOT_FOUND);
    const countPost = await Posts.countDocuments({ _id: post });
    if (!countPost) throw new CreateError.NotFound(ERROR_CODES.POST_NOT_FOUND);
    /* get followers  */
    const followers = await Followers.find({ userId: sender });
    const followerIds = followers.map((follower) => follower.followerId.toString());
    const newBody = _.cloneDeep(body);
    newBody.followerIds = followerIds;
    return newBody;
}

module.exports = {
    validateCreatePostNotify
};
