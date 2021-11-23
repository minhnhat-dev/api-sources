const mongoose = require("mongoose");

const { Schema } = mongoose;

const { ObjectId } = Schema.Types;

const ConversationsSchema = new Schema({
    userId: { type: ObjectId, ref: "Users" },
    token: { type: String, required: true }
}, { versionKey: false, timestamps: true });

ConversationsSchema.index({ userId: 1, token: 1 });
module.exports = mongoose.model("RefreshTokens", ConversationsSchema, "refresh-tokens");
