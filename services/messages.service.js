/* eslint-disable radix */
const _ = require("lodash");
const { Messages, Users } = require("../datasources/mongodb/models");
const { convertSelectQuery, buildSortStringToObject } = require("../helpers/query.helper");
const { STATUS } = require("../constants/messages.constant");
const { SKIP_DEFAULT, LIMIT_DEFAULT } = require("../constants/global.constant");

async function createMessage(data) {
    const message = await Messages.create(data);
    /* attach user */
    const messageObject = message.toObject();
    const { sender } = messageObject;

    const user = await Users
        .findOne({ _id: sender })
        .select("_id name")
        .lean();

    messageObject.sender = user;
    return messageObject;
}

async function getListMessages(query) {
    const {
        skip = SKIP_DEFAULT,
        limit = LIMIT_DEFAULT,
        sort,
        select,
        searchText,
        isAll = false,
        conversationId,
        status
    } = query;

    const conditions = { status: STATUS.ACTIVE };
    const selects = convertSelectQuery(select);
    const sortObject = buildSortStringToObject(sort);

    if (searchText) {
        conditions.$or = [
            { text: { $regex: searchText.trim(), $options: "i" } }
        ];
    }

    if (conversationId) {
        conditions.conversationId = conversationId;
    }

    if (status) {
        conditions.status = status;
    }

    const [messages = [], total = 0] = await Promise.all([
        Messages.find(conditions)
            .sort(sortObject)
            .skip(isAll ? 0 : Number(skip))
            .limit(isAll ? 0 : Number(limit))
            .populate({
                path: "sender",
                select: "_id name"
            })
            .select(selects)
            .lean(),
        Messages.countDocuments(conditions)
    ]);

    return { messages, total };
}

// async function getPost(id) {
//     const post = await Posts.findById(id).lean();
//     return post;
// }

// async function updatePost(id, data) {
//     const postUpdated = await Posts.findByIdAndUpdate(id, data, { new: true });
//     return postUpdated;
// }

// async function deletePost(id) {
//     return Posts.deleteOne({ _id: id });
// }

// async function likePost(id, data) {
//     const { userId } = data;
//     await Likes.create({ userId, postId: id });
//     return Posts.findByIdAndUpdate(id, { $inc: { totalLikes: 1 } }, { new: true });
// }

// async function unlikePost(id, data) {
//     const { userId } = data;
//     await Likes.deleteOne({ userId, postId: id });
//     return Posts.findByIdAndUpdate(id, { $inc: { totalLikes: -1 } }, { new: true });
// }

// async function getTimelineByUserId(query) {
//     const {
//         sort,
//         userId,
//         limit = LIMIT_DEFAULT,
//         skip = SKIP_DEFAULT
//     } = query;

//     const sortObject = buildSortStringToObject(sort);
//     const followings = await Followings.find({ userId, status: STATUS_FOLLOWINGS.ACTIVE });
//     const usersFollowingsIds = _.uniq(followings.map((item) => item.followingId.toString()));
//     const usersIds = _.uniq([userId, ...usersFollowingsIds]);
//     const condition = { userId: { $in: usersIds }, status: STATUS_POSTS.ACTIVE };

//     const [posts = [], total = 0] = await Promise.all([
//         Posts.find(condition).sort(sortObject)
//             .skip(skip)
//             .limit(limit)
//             .lean(),
//         Posts.countDocuments(condition)
//     ]);

//     return { posts, total };
// }

// async function checkIsLikePost(id, userId) {
//     const count = await Likes.countDocuments({ userId, postId: id });
//     return !!count;
// }

module.exports = {
    createMessage,
    getListMessages
};
