const mongoose = require("mongoose");

const { Schema } = mongoose;

const { ObjectId } = Schema.Types;

const CommentsSchema = new Schema({
    userId: { type: ObjectId, ref: "Users", required: true },
    postId: { type: ObjectId, ref: "Posts", required: true },
    content: { type: String, trim: true, required: true },
    totalLikes: { type: Number, default: 0 }
}, { versionKey: false, timestamps: true });

CommentsSchema.index({ postId: 1, createdAt: -1 });

module.exports = mongoose.model("Comments", CommentsSchema);
