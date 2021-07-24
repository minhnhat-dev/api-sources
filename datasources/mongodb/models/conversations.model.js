const mongoose = require("mongoose");
const { STATUS, TYPES } = require("../../../constants/conversations.constant");

const { Schema } = mongoose;

const { ObjectId } = Schema.Types;

const ConversationsSchema = new Schema({
    members: [{
        type: ObjectId,
        ref: "Users"
    }],
    status: {
        type: Number,
        enum: Object.values(STATUS),
        default: STATUS.ACTIVE
    },
    type: {
        type: Number,
        enum: Object.values(TYPES),
        default: TYPES.PRIVATE
    },
    name: String
}, { versionKey: false, timestamps: true });

ConversationsSchema.index({ type: 1, status: 1, nembers: 1 });
module.exports = mongoose.model("Conversations", ConversationsSchema);
