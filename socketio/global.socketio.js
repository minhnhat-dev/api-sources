const { UserBindingContext } = require("twilio/lib/rest/chat/v2/service/user/userBinding");
const _ = require("lodash");
const { Followers, Users } = require("../datasources/mongodb/models");

let users = [];
const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

function globaltSocketIO(io) {
    io.on("connection", (socket) => {
        console.log(`+ ${socket.id} is global connnect....`);
        socket.on("joinUser", (user) => {
            const { id } = user;
            const userSave = {
                userId: id,
                socketId: socket.id
            };
            users.push(userSave);
            console.log("users", users);
        });
        socket.on("disconnect", () => {
            removeUser(socket.id);
            console.log(`+ ${socket.id} is disconnect....`);
            console.log("users", users);
        });

        /* like post */
        socket.on("likePost", async (newPost) => {
            const { user } = newPost;
            /* get followers of user create post */
            const followerIds = await getFollowerIds(user);
            const clients = users.filter((userOnline) => followerIds.includes(userOnline.userId));
            if (clients.length > 0) {
                clients.forEach((userOnline) => {
                    socket.to(`${userOnline.socketId}`).emit("likeToClient", newPost);
                });
            }
        });
        /* unlike post */
        socket.on("unLikePost", async (newPost) => {
            const { user } = newPost;
            /* get followers of user create post */
            const followerIds = await getFollowerIds(user);
            const clients = users.filter((userOnline) => followerIds.includes(userOnline.userId));
            if (clients.length > 0) {
                clients.forEach((userOnline) => {
                    socket.to(`${userOnline.socketId}`).emit("unLikeToClient", newPost);
                });
            }
        });
        /* create comments */
        socket.on("createComment", async (newPost) => {
            const { user } = newPost;
            /* get followers of user create post */
            const followerIds = await getFollowerIds(user);
            const clients = users.filter((userOnline) => followerIds.includes(userOnline.userId));
            if (clients.length > 0) {
                clients.forEach((userOnline) => {
                    socket.to(`${userOnline.socketId}`).emit("createCommentToClient", newPost);
                });
            }
        });
        /* upate comments */
        socket.on("updateComment", async (newPost) => {
            const { user } = newPost;
            /* get followers of user create post */
            const followerIds = await getFollowerIds(user);
            const clients = users.filter((userOnline) => followerIds.includes(userOnline.userId));
            if (clients.length > 0) {
                clients.forEach((userOnline) => {
                    socket.to(`${userOnline.socketId}`).emit("updateCommentToClient", newPost);
                });
            }
        });

        socket.on("follow", async ({ user, followerId }) => {
            console.log("+follow() followerId", followerId);
            const userFound = users.find((item) => item.userId === followerId);
            if (userFound) {
                socket.to(`${userFound.socketId}`).emit("followToClient", user);
            }
        });

        socket.on("unfollow", async ({ user, unFollowerId }) => {
            console.log("+unfollow() unFollowerId", unFollowerId);
            const userFound = users.find((item) => item.userId === unFollowerId);
            if (userFound) {
                socket.to(`${userFound.socketId}`).emit("unfollowToClient", user);
            }
        });

        socket.on("createNotify", (notifies) => {
            const receiptIds = notifies.map((notify) => notify.receipt.id);
            const notifiesKeyByReceptId = _.keyBy(notifies, "receipt.id");
            const clients = users.filter((userOnline) => receiptIds.includes(userOnline.userId));
            if (clients.length > 0) {
                clients.forEach((userOnline) => {
                    const notifyFound = notifiesKeyByReceptId[userOnline.userId] || null;
                    if (notifyFound) {
                        socket.to(`${userOnline.socketId}`).emit("createNotifyToClient", notifyFound);
                    }
                });
            }
        });

        socket.on("removeNotify", async (post) => {
            const userCreatePost = post.user.id;
            const postId = post.id;
            /* get followers of user create post */
            const followerIds = await getFollowerIds(userCreatePost);
            const clients = users.filter((userOnline) => followerIds.includes(userOnline.userId));
            if (clients.length > 0) {
                clients.forEach((userOnline) => {
                    socket.to(`${userOnline.socketId}`).emit("removeNotifyToClient", postId);
                });
            }
        });
    });
}

async function getFollowerIds(userId) {
    const followers = await Followers.find({ userId });
    const followerIds = followers.map((item) => item.followerId.toString());
    followerIds.push(userId);
    return followerIds;
}

module.exports = {
    globaltSocketIO
};
