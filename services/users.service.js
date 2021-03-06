/* eslint-disable radix */
const _ = require("lodash");
const { Users, Followers, Followings, RefreshTokens } = require("../datasources/mongodb/models");
const { convertSelectQuery, buildSortStringToObject } = require("../helpers/query.helper");
const { SKIP_DEFAULT, LIMIT_DEFAULT } = require("../constants/global.constant");
const { STATUS } = require("../constants/followings.constant");
const FollowingDto = require("../dtos/followings.dtos");

async function createUser(data) {
    const user = new Users(data);
    user.setPassword(data.password);
    await user.save();
    return user;
}

async function createUserPhoneEmail(data) {
    const user = await Users.create(data);
    return user;
}

async function storageRefreshToken(data) {
    const refreshToken = await RefreshTokens.create(data);
    return refreshToken;
}

async function getListUsers(query) {
    const {
        skip = SKIP_DEFAULT,
        limit = LIMIT_DEFAULT,
        sort,
        select,
        searchText,
        isAll = false,
        ids
    } = query;

    const conditions = {};
    const selects = convertSelectQuery(select);
    const sortObject = buildSortStringToObject(sort);

    if (searchText) {
        conditions.$or = [
            // { name: { $regex: searchText.trim(), $options: "i" } },
            // { email: { $regex: searchText.trim(), $options: "i" } },
            { username: { $regex: searchText.trim(), $options: "i" } }
        ];
    }

    if (ids) {
        const userIds = ids.split(",");
        conditions._id = { $in: userIds };
    }

    const [users = [], total = 0] = await Promise.all([
        Users
            .find(conditions)
            .sort(sortObject)
            .skip(isAll ? 0 : Number(skip))
            .limit(isAll ? 0 : Number(limit))
            .select(selects)
            .lean(),
        Users.countDocuments(conditions)
    ]);
    return { users, total };
}

async function getUser(id) {
    const user = await Users.findById(id).lean();
    return user;
}

async function updateUser(id, data) {
    const userUpdated = await Users.findByIdAndUpdate(id, { $set: data }, { new: true });
    if (data.password) {
        userUpdated.setPassword(data.password);
        await userUpdated.save();
    }
    return userUpdated;
}

async function handleFollow(data) {
    const { userId, followerId } = data;
    /* create follower  */
    const [follower, following] = await Promise.all([
        Followers.create({ userId: followerId, followerId: userId }),
        Followings.create({ userId, followingId: followerId })
    ]);
    /* update total follower &  following for user */
    const [userFollowerUpdated, userFollowingUpdated] = await Promise.all([
        Users.findByIdAndUpdate(userId, { $inc: { totalFollowings: 1 } }, { new: true }),
        Users.findByIdAndUpdate(followerId, { $inc: { totalFollowers: 1 } }, { new: true })
    ]);

    return userFollowerUpdated;
}

async function handleFollowTransation(userId, data) {
    const { followerId } = data;
    const session = await Users.startSession();
    session.startTransaction();
    try {
        /* create follower  */
        const follower = await Followers.create([{ userId: followerId, followerId: userId }], { session });
        console.log("follower", follower);
        const following = await Followings.create([{ userId, followingId: followerId }], { session });
        console.log("following", following);

        /* update total follower &  following for user */
        const userFollowerUpdated = await Users.findByIdAndUpdate(
            userId,
            { $inc: { totalFollowings: 1 } },
            { session, new: true }
        ).lean();

        const userFollowingUpdated = await Users.findByIdAndUpdate(
            followerId,
            { $inc: { totalFollowers: 1 } },
            { session, new: true }
        ).lean();

        await session.commitTransaction();
        session.endSession();
        return userFollowerUpdated;
    } catch (error) {
        console.error("error", error);
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

async function handleUnFollow(data) {
    const { userId, unFollowerId } = data;
    /* create follower  */
    const [follower, following] = await Promise.all([
        Followers.deleteOne({ userId: unFollowerId, followerId: userId }),
        Followings.deleteOne({ userId, followingId: unFollowerId })
    ]);
    /* update total follower &  following for user */
    const [userUnFollowerUpdated, userFollowingUpdated] = await Promise.all([
        Users.findByIdAndUpdate(userId, { $inc: { totalFollowings: -1 } }, { new: true }),
        Users.findByIdAndUpdate(unFollowerId, { $inc: { totalFollowers: -1 } }, { new: true })
    ]);

    return userUnFollowerUpdated;
}

async function getFollowers(query) {
    const {
        skip = SKIP_DEFAULT,
        limit = LIMIT_DEFAULT,
        sort,
        select,
        userId
    } = query;

    const conditions = {};
    const selects = convertSelectQuery(select);
    const sortObject = buildSortStringToObject(sort);

    if (userId) {
        conditions.userId = userId;
    }

    const [followers = [], total = 0] = await Promise.all([
        Followers
            .find(conditions)
            .sort(sortObject)
            .skip(Number(skip))
            .limit(Number(limit))
            .select(selects)
            .lean(),
        Followers.countDocuments(conditions)
    ]);

    const followerIds = followers.map((item) => item.followerId);
    const users = await getUserByIds(followerIds);
    const usersKeyById = _.keyBy(users, "_id");

    /* attach user into response */
    const newFollowers = followers.map((item) => {
        const { followerId } = item;
        const user = usersKeyById[followerId.toString()] || null;
        item.user = user;
        return item;
    });

    return { followers: newFollowers, total };
}

async function getFollowings(query) {
    const {
        skip = SKIP_DEFAULT,
        limit = LIMIT_DEFAULT,
        sort,
        select,
        userId
    } = query;

    const conditions = {};
    const selects = convertSelectQuery(select);
    const sortObject = buildSortStringToObject(sort);

    if (userId) {
        conditions.userId = userId;
    }
    console.log("conditions", conditions);
    const [followings = [], total = 0] = await Promise.all([
        Followings
            .find(conditions)
            .sort(sortObject)
            .skip(Number(skip))
            .limit(Number(limit))
            .select(selects)
            .populate({
                path: "followingId",
                select: "-password -salt"
            })
            .lean(),
        Followings.countDocuments(conditions)
    ]);
    /* attach user into response */
    const newFollowings = followings.map((item) => new FollowingDto(item));
    return { followings: newFollowings, total };
}

async function getUserByIds(ids) {
    return Users.find({ _id: { $in: ids } }).lean();
}

async function getUserByFilter(filter = {}) {
    return Users.findOne(filter);
}

async function getAllFollowings(userId) {
    const followings = await Followings
        .find({ userId, status: STATUS.ACTIVE })
        .select("_id followingId")
        .lean();
    return followings;
}

module.exports = {
    createUser,
    getListUsers,
    getUser,
    updateUser,
    handleFollow,
    handleUnFollow,
    getFollowers,
    getFollowings,
    getUserByFilter,
    createUserPhoneEmail,
    storageRefreshToken,
    getAllFollowings
};
