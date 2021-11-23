/* eslint-disable radix */
const _ = require("lodash");
const mongoose = require("mongoose");
const { Conversations } = require("../datasources/mongodb/models");
const { convertSelectQuery, buildSortStringToObject } = require("../helpers/query.helper");
const { SKIP_DEFAULT, LIMIT_DEFAULT } = require("../constants/global.constant");
const { STATUS, TYPES } = require("../constants/conversations.constant");

const { Schema } = mongoose;

const { ObjectId } = Schema.Types;
async function createConversation(data) {
    const conversation = await Conversations.create(data);
    return conversation;
}

async function getListConversations(query) {
    const { skip = SKIP_DEFAULT, limit = LIMIT_DEFAULT, sort, select, searchText, isAll = false, userId } = query;

    const conditions = {};
    const selects = convertSelectQuery(select);
    const sortObject = buildSortStringToObject(sort);

    if (searchText) {
        conditions.$or = [{ name: { $regex: searchText.trim(), $options: "i" } }];
    }

    if (userId) {
        conditions.members = { $in: [userId] };
    }

    const [conversations = [], total = 0] = await Promise.all([
        Conversations.find(conditions)
            .sort(sortObject)
            .skip(isAll ? 0 : Number(skip))
            .limit(isAll ? 0 : Number(limit))
            .populate({
                path: "members",
                select: "_id username profilePicture"
            })
            .select(selects)
            .lean(),
        Conversations.countDocuments(conditions)
    ]);

    return { conversations, total };
}

async function checkConversationExists(query) {
    const { users, type } = query;
    const usersSplit = users.split(",");

    if (type === TYPES.PRIVATE) {
        const conversation = await Conversations.findOne({
            type,
            status: STATUS.ACTIVE,
            members: { $all: _.uniq(usersSplit) }
        }).lean();
        if (!conversation) return { is_exists: false, conversation: null };
        return { is_exists: true, conversation };
    }

    return { is_exists: false, conversation: null };
}

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
    createConversation,
    getListConversations,
    checkConversationExists
};
