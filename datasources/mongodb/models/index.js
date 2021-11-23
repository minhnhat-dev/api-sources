const Users = require("./users.model");
const Posts = require("./posts.model");
const Followers = require("./followers.model");
const Followings = require("./followings.model");
const Likes = require("./likes.model");
const Conversations = require("./conversations.model");
const Messages = require("./messages.model");
const RefreshTokens = require("./refresh-tokens.model");
const Broads = require("./broads.model");
const Comments = require("./comments.model");
const CommentLikes = require("./comment-likes.model");
const PostNotifies = require("./post-notifies.model");

module.exports = {
    Users,
    Followers,
    Followings,
    Posts,
    Likes,
    Conversations,
    Messages,
    RefreshTokens,
    Broads,
    Comments,
    CommentLikes,
    PostNotifies
};
