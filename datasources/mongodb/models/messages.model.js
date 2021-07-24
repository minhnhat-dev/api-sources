const mongoose = require("mongoose");
const { STATUS, TYPES } = require("../../../constants/messages.constant");

const { Schema } = mongoose;

const { ObjectId } = Schema.Types;

const MessagesSchema = new Schema({
    conversationId: ObjectId,
    // sender: ObjectId,
    sender: { type: ObjectId, ref: "Users" },
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
    text: String
}, { versionKey: false, timestamps: true });

MessagesSchema.index({ status: 1, conversationId: 1 });
module.exports = mongoose.model("Messages", MessagesSchema);
