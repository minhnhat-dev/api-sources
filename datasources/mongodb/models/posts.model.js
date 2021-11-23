const mongoose = require("mongoose");
const { STATUS, VISIBLE } = require("../../../constants/posts.constant");

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const PostsSchema = new Schema({
    user: { type: ObjectId, ref: "Users" },
    content: String,
    images: [],
    status: {
        type: Number,
        default: STATUS.ACTIVE,
        enum: Object.values(STATUS)
    },
    totalLikes: { type: Number, default: 0 },
    totalComments: { type: Number, default: 0 },
    visible: { type: Number, default: VISIBLE.PUBLID }
}, { versionKey: false, timestamps: true });

module.exports = mongoose.model("Posts", PostsSchema);
