const mongoose = require("mongoose");

const { Schema } = mongoose;

const { ObjectId } = Schema.Types;

const LikesSchema = new Schema({
    userId: { type: ObjectId, ref: "Users" },
    postId: ObjectId,
    icon: String
}, { versionKey: false, timestamps: true });

module.exports = mongoose.model("Likes", LikesSchema);
