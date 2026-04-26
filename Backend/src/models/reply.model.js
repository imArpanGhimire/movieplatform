const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
    {
        review: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "review",
            required: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },

        parentReply: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "reply",
            default: null,
        },

        text: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("reply", replySchema);