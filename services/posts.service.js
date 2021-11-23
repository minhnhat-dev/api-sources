/* eslint-disable no-restricted-syntax */
/* eslint-disable radix */
const _ = require("lodash");
const { Posts, Likes, Users, PostNotifies, Followings, Comments, CommentLikes } = require("../datasources/mongodb/models");
const { convertSelectQuery, buildSortStringToObject } = require("../helpers/query.helper");
const { STATUS: STATUS_FOLLOWINGS } = require("../constants/followings.constant");
const { STATUS: STATUS_POSTS } = require("../constants/posts.constant");
const { SKIP_DEFAULT, LIMIT_DEFAULT } = require("../constants/global.constant");
const LikesDtos = require("../dtos/likes.dtos");
const CommentsDtos = require("../dtos/comments.dtos");

async function createPost(data) {
    let post = await Posts.create(data);
    if (post) {
        post = post.toObject();
        /* get user */
        const { user } = post;
        const userFound = await Users
            .findOne({ _id: user })
            .select("_id name profilePicture username")
            .lean();
        if (userFound) {
            post.user = userFound;
        }
    }
    return post;
}

async function getListPosts(query) {
    const {
        skip = SKIP_DEFAULT,
        limit = LIMIT_DEFAULT,
        sort,
        select,
        searchText,
        isAll = false,
        userId
    } = query;

    const conditions = {};
    const selects = convertSelectQuery(select);
    const sortObject = buildSortStringToObject(sort);

    if (searchText) {
        conditions.$or = [
            { description: { $regex: searchText.trim(), $options: "i" } }
        ];
    }

    if (userId) {
        conditions.user = userId;
    }
    console.log("conditions", conditions);
    const [posts = [], total = 0] = await Promise.all([
        Posts.find(conditions)
            .sort(sortObject)
            .skip(isAll ? 0 : Number(skip))
            .limit(isAll ? 0 : Number(limit))
            .populate({
                path: "user",
                select: "_id name profilePicture username"
            })
            .select(selects)
            .lean(),
        Posts.countDocuments(conditions)
    ]);
    /* check is like with current userId */

    // if (userIdCheckLike && posts.length) {
    //     const postIds = posts.map((post) => post._id);
    //     const queryLike = {
    //         userId: userIdCheckLike,
    //         postId: { $in: postIds }
    //     };
    //     const postLikes = await Likes.find(queryLike).lean();

    //     const postLikesKeyByPostId = _.keyBy(postLikes, (item) => {
    //         const { postId, userId: userIdLike } = item;
    //         return `${userIdLike}_${postId}`;
    //     });

    //     /* overwrite posts */
    //     const newPosts = posts.map((post) => {
    //         const { _id: postId } = post;
    //         post.isLike = false;
    //         const key = `${userIdCheckLike}_${postId.toString()}`;
    //         const foundLike = postLikesKeyByPostId[key] || null;
    //         if (foundLike) post.isLike = true;
    //         return post;
    //     });

    //     return { posts: newPosts, total };
    // }
    // const userIds = posts.map((post) => post.userId.toString());
    // const users = await Users.find({ _id: { $in: userIds } }).lean();
    // const usersKeyById = _.keyBy(users, "_id");

    // const newPosts = posts.map((post) => {
    //     const { userId: userIdPost } = post;
    //     post.user = usersKeyById[userIdPost.toString()] || null;
    //     return post;
    // });

    return { posts, total };
}

async function getListPostImages(query) {
    const {
        skip = SKIP_DEFAULT,
        limit = LIMIT_DEFAULT,
        sort,
        select,
        searchText,
        isAll = false,
        userId
    } = query;

    const conditions = {
        "images.1": { $exists: true }
    };
    const selects = convertSelectQuery(select);
    const sortObject = buildSortStringToObject(sort);

    if (searchText) {
        conditions.$or = [
            { description: { $regex: searchText.trim(), $options: "i" } }
        ];
    }

    if (userId) {
        conditions.user = userId;
    }
    const [posts = [], total = 0] = await Promise.all([
        Posts.find(conditions)
            .sort(sortObject)
            .skip(isAll ? 0 : Number(skip))
            .limit(isAll ? 0 : Number(limit))
            .populate({
                path: "user",
                select: "_id name profilePicture username"
            })
            .select(selects)
            .lean(),
        Posts.countDocuments(conditions)
    ]);

    let images = [];
    for (const post of posts) {
        images = [...images, ...post.images];
    }
    const newImages = _.chunk(images, 9);
    return { images: newImages[0], total };
}

async function getPost(id) {
    const post = await Posts.findById(id).lean();
    return post;
}

async function updatePost(id, data) {
    let postUpdated = await Posts.findByIdAndUpdate(id, data, { new: true });
    if (postUpdated) {
        postUpdated = postUpdated.toObject();
        /* get user */
        const { user } = postUpdated;
        const userFound = await Users
            .findOne({ _id: user })
            .select("_id name profilePicture username")
            .lean();
        if (userFound) {
            postUpdated.user = userFound;
        }
    }
    return postUpdated;
}

async function deletePost(id) {
    return Promise.all([
        Posts.deleteOne({ _id: id }),
        Comments.deleteMany({ postId: id }),
        PostNotifies.deleteMany({ post: id })
    ]);
}

async function likePost(id, data) {
    const { userId } = data;
    await Likes.create({ userId, postId: id });
    return Posts.findByIdAndUpdate(id, { $inc: { totalLikes: 1 } }, { new: true });
}

async function unlikePost(id, data) {
    const { userId } = data;
    await Likes.deleteOne({ userId, postId: id });
    return Posts.findByIdAndUpdate(id, { $inc: { totalLikes: -1 } }, { new: true });
}

async function getTimelineByUserId(query) {
    const {
        sort,
        userId,
        limit = LIMIT_DEFAULT,
        skip = SKIP_DEFAULT
    } = query;

    const sortObject = buildSortStringToObject(sort);
    const followings = await Followings.find({ userId, status: STATUS_FOLLOWINGS.ACTIVE });
    const usersFollowingsIds = _.uniq(followings.map((item) => item.followingId.toString()));
    const usersIds = _.uniq([userId, ...usersFollowingsIds]);
    const condition = { userId: { $in: usersIds }, status: STATUS_POSTS.ACTIVE };

    const [posts = [], total = 0] = await Promise.all([
        Posts.find(condition).sort(sortObject)
            .skip(skip)
            .limit(limit)
            .lean(),
        Posts.countDocuments(condition)
    ]);

    return { posts, total };
}

async function checkIsLikePost(id, userId) {
    const count = await Likes.countDocuments({ userId, postId: id });
    return !!count;
}

async function getLikesPost(id, query) {
    const {
        skip = SKIP_DEFAULT,
        limit = LIMIT_DEFAULT,
        sort,
        select,
        isAll = false
    } = query;

    const conditions = {
        postId: id
    };
    const selects = convertSelectQuery(select);
    const sortObject = buildSortStringToObject(sort);

    const [likes = [], total = 0] = await Promise.all([
        Likes.find(conditions)
            .sort(sortObject)
            .skip(isAll ? 0 : Number(skip))
            .limit(isAll ? 0 : Number(limit))
            .populate({
                path: "userId",
                select: "_id name profilePicture username"
            })
            .select(selects)
            .lean(),
        Likes.countDocuments(conditions)
    ]);
    const newLikes = likes.map((item) => new LikesDtos(item));
    return { likes: newLikes, total };
}

async function createComment(id, data) {
    const newComment = await Comments.create(data);
    if (newComment) {
        await Posts.findByIdAndUpdate(id, { $inc: { totalComments: 1 } });
    }

    return newComment;
}
async function getComments(id, query) {
    const {
        skip = SKIP_DEFAULT,
        limit = LIMIT_DEFAULT,
        sort,
        select,
        isAll = false,
        userId
    } = query;

    const conditions = {
        postId: id
    };
    const selects = convertSelectQuery(select);
    const sortObject = buildSortStringToObject(sort);

    const [comments = [], total = 0] = await Promise.all([
        Comments.find(conditions)
            .sort(sortObject)
            .skip(isAll ? 0 : Number(skip))
            .limit(isAll ? 0 : Number(limit))
            .populate({
                path: "userId",
                select: "_id name profilePicture username"
            })
            .select(selects)
            .lean(),
        Comments.countDocuments(conditions)
    ]);
    /* get is-like with current user */

    let newComments = comments.map((item) => new CommentsDtos(item));

    if (userId) {
        const commentIds = comments.map((item) => item._id);
        const commentLikes = await CommentLikes.find({
            userId,
            commentId: { $in: commentIds }
        }).lean();
        const commentLikesKeyById = _.keyBy(commentLikes, "commentId");

        newComments = newComments.map((item) => {
            const { id: commentId } = item;
            item.isLikeComment = false;
            if (commentLikesKeyById[commentId.toString()]) item.isLikeComment = true;
            return item;
        });
    }
    return { comments: newComments, total };
}

async function createLikeComment(id, data) {
    await CommentLikes.create(data);
    return Comments.findByIdAndUpdate(id, { $inc: { totalLikes: 1 } }, { new: true })
        .populate({
            path: "userId",
            select: "_id name profilePicture username"
        })
        .lean();
}

async function checkIsLikeComment(body) {
    const { userId, commentId } = body;
    const count = await CommentLikes.countDocuments({ userId, commentId });
    return !!count;
}

async function unlikeComment(id, data) {
    const { commentId } = data;
    await CommentLikes.deleteMany({ commentId });
    return Comments.findByIdAndUpdate(id, { $inc: { totalLikes: -1 } }, { new: true }).lean();
}

async function updateComment(id, data) {
    const newComment = await Comments.findByIdAndUpdate(id, data, { new: true }).lean();
    return newComment;
}

async function deleteComment(body) {
    const { commentId, postId } = body;
    await Comments.deleteOne({ _id: commentId });
    const newPost = await Posts.findByIdAndUpdate(postId, { $inc: { totalComments: -1 } }, { new: true });
    console.log("newPost", newPost);
    return newPost;
}

async function deletePostComment(postId) {
    await Posts.deleteOne({ _id: postId });
    await Comments.deleteMany({ postId });
    return PostNotifies.deleteMany({ post: postId });
}

module.exports = {
    createPost,
    getListPosts,
    getPost,
    updatePost,
    deletePost,
    likePost,
    unlikePost,
    getTimelineByUserId,
    checkIsLikePost,
    getLikesPost,
    createComment,
    getComments,
    createLikeComment,
    checkIsLikeComment,
    unlikeComment,
    updateComment,
    deleteComment,
    getListPostImages,
    deletePostComment
};
