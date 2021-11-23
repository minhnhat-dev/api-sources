const mongoose = require("mongoose");
const { STATUS } = require("../../../constants/followings.constant");

const { Schema } = mongoose;

const { ObjectId } = Schema.Types;

const FollowingsSchema = new Schema({
    userId: ObjectId,
    followingId: { type: ObjectId, ref: "Users" },
    status: {
        type: Number,
        enum: Object.values(STATUS),
        default: STATUS.ACTIVE
    }
}, { versionKey: false, timestamps: true });

module.exports = mongoose.model("Followings", FollowingsSchema);
