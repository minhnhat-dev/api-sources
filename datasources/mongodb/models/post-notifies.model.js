const mongoose = require("mongoose");

const { Schema } = mongoose;

const { ObjectId } = Schema.Types;

const PostNotifiesSchema = new Schema({
    post: { type: ObjectId, ref: "Posts" },
    sender: { type: ObjectId, ref: "Users" },
    receipt: { type: ObjectId, ref: "Users" },
    url: String,
    text: String,
    isRead: { type: Boolean, default: false }
}, { versionKey: false, timestamps: true });

PostNotifiesSchema.index({ createdAt: -1, user: 1 });
module.exports = mongoose.model("PostNotifies", PostNotifiesSchema);
