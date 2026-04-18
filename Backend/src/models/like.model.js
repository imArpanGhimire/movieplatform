const mongoose = require("mongoose")

const likeschema = new mongoose.Schema({
    review: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "review",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
})

likeschema.index({ review: 1, user: 1 }, { unique: true })

const likemodel = mongoose.model("like", likeschema)

module.exports = likemodel