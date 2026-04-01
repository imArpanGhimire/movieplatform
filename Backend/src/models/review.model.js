const mongoose = require("mongoose")

const reviewschema = new mongoose.Schema({
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "movie",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    isEdited: {
        type: Boolean,
        default: false
    },
},
    { timestamps: true }
)

const reviewmodel = mongoose.model("review", reviewschema)

module.exports = reviewmodel