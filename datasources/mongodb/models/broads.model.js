const mongoose = require("mongoose");
const { STATUS, TYPES, DEFAULT_BACKGROUND } = require("../../../constants/broads.constant");

const { Schema } = mongoose;

const { ObjectId } = Schema.Types;
const BroadsSchema = new Schema({
    status: {
        type: Number,
        enum: Object.values(STATUS),
        default: STATUS.ACTIVE
    },
    type: {
        type: Number,
        enum: Object.values(TYPES),
        default: TYPES.PUBLIC
    },
    backgroundColor: { type: String, default: DEFAULT_BACKGROUND },
    name: { type: String, required: true },
    userId: { type: ObjectId, required: true }
}, { versionKey: false, timestamps: true });

BroadsSchema.index({ status: 1, name: 1, userId: 1 });

module.exports = mongoose.model("Broads", BroadsSchema);
