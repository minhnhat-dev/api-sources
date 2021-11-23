const mongoose = require("mongoose");

const { Schema } = mongoose;

const { ObjectId } = Schema.Types;

const CommentLikesSchema = new Schema({
    userId: { type: ObjectId, ref: "Users" },
    postId: { type: ObjectId, ref: "Posts" },
    commentId: { type: ObjectId, ref: "Comments" }
}, { versionKey: false, timestamps: true });

CommentLikesSchema.index({ commentId: 1, userId: 1 });

module.exports = mongoose.model("CommentLikes", CommentLikesSchema);
