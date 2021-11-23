const mongoose = require("mongoose");
const { STATUS } = require("../../../constants/followers.constant");

const { Schema } = mongoose;

const { ObjectId } = Schema.Types;
/*
    Khi A ấn nút theo  dõi B thì object này đc tạo ra
    + userId: là user B
    + followerId: là A
    -> ý nghĩa là user B có 1 người theo dõi và followerId là A

    -> ngược lại bền model following thì
    + userId: là user A
    + followerId: là B
    -> ý nghĩa là user A đang theo dõi B

    => Đứng từ A :
    ===>(followings: ta theo dõi) Khi ta muốn lấy danh sách những người ta theo dõi thì cứ đè model following query là lấy đc
    ===>(followers: ai đó theo dõi ta) Khi ta muốn lấy danh sách những người theo dõi ta thì cứ đè model followers query là lấy đc

*/
/* Follower dùng để lấy DS những người đang theo dõi ta (chủ thể là userId) */
/* Following dùng để lấy DS những người ta theo dõi (chủ thể là userId) */
const FollowersSchema = new Schema({
    userId: ObjectId,
    followerId: ObjectId,
    status: {
        type: Number,
        enum: Object.values(STATUS),
        default: STATUS.ACTIVE
    }
}, { versionKey: false, timestamps: true });

module.exports = mongoose.model("Followers", FollowersSchema);
