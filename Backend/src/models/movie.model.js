const mongoose = require("mongoose")

const movieschema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    director: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    }
})

const moviemodel = mongoose.model("movie", movieschema)

module.exports = moviemodel