const mongoose = require("mongoose");
const { STATUS, TYPES } = require("../../../constants/messages.constant");

const { Schema } = mongoose;

const { ObjectId } = Schema.Types;

const MessagesSchema = new Schema({
    conversation: { type: ObjectId, ref: "Conversations" },
    sender: { type: ObjectId, ref: "Users" },
    receiver: { type: ObjectId, ref: "Users" },
    status: {
        type: Number,
        enum: Object.values(STATUS),
        default: STATUS.ACTIVE
    },
    text: String,
    media: Array
}, { versionKey: false, timestamps: true });

MessagesSchema.index({ status: 1, conversation: 1 });
module.exports = mongoose.model("Messages", MessagesSchema);
