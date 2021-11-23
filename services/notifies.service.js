/* eslint-disable radix */
const _ = require("lodash");
const { Messages, Users, PostNotifies } = require("../datasources/mongodb/models");
const { convertSelectQuery, buildSortStringToObject } = require("../helpers/query.helper");
const { STATUS } = require("../constants/messages.constant");
const { SKIP_DEFAULT, LIMIT_DEFAULT } = require("../constants/global.constant");

async function createPostNotify(data) {
    const { followerIds = [], post, sender, url, text } = data;
    const postNotifies = followerIds.map((followerId) => ({
        receipt: followerId,
        post,
        sender,
        url,
        text
    }));
    const result = await PostNotifies.insertMany(postNotifies);
    const postNotifyIds = result.map((item) => item._id);

    const postNotifiesRes = await PostNotifies.find({ _id: { $in: postNotifyIds } })
        .populate({
            path: "sender",
            select: "_id name profilePicture username"
        })
        .populate({
            path: "receipt",
            select: "_id name profilePicture username"
        }).lean();

    return postNotifiesRes;
}

async function updatePostNotify(id, data) {
    const newPostNotifies = await PostNotifies.findByIdAndUpdate(id, data, { new: true })
        .populate({
            path: "sender",
            select: "_id name profilePicture username"
        })
        .populate({
            path: "receipt",
            select: "_id name profilePicture username"
        }).lean();
    return newPostNotifies;
}

async function deletePostNotify(id) {
    const result = await PostNotifies.deleteOne({ _id: id });
    return result;
}

async function clearPostNotify(query) {
    const { userId } = query;
    const result = await PostNotifies.deleteMany({ receipt: userId });
    return result;
}

async function getListPostNotify(query) {
    const {
        skip = SKIP_DEFAULT,
        limit = LIMIT_DEFAULT,
        sort,
        select,
        searchText,
        isAll = false,
        receipt,
        isRead
    } = query;

    const conditions = { isRead: false };
    const selects = convertSelectQuery(select);
    const sortObject = buildSortStringToObject(sort);

    if (searchText) {
        conditions.$or = [
            { text: { $regex: searchText.trim(), $options: "i" } }
        ];
    }

    if (receipt) {
        conditions.receipt = receipt;
    }

    if (isRead) {
        conditions.isRead = isRead;
    }

    const [notifies = [], total = 0] = await Promise.all([
        PostNotifies.find(conditions)
            .sort(sortObject)
            .skip(isAll ? 0 : Number(skip))
            .limit(isAll ? 0 : Number(limit))
            .populate({
                path: "sender",
                select: "_id name profilePicture username"
            })
            .populate({
                path: "receipt",
                select: "_id name profilePicture username"
            })
            .select(selects)
            .lean(),
        PostNotifies.countDocuments(conditions)
    ]);

    return { notifies, total };
}
module.exports = {
    createPostNotify,
    getListPostNotify,
    deletePostNotify,
    updatePostNotify,
    clearPostNotify
};
