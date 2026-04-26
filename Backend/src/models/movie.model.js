const mongoose = require("mongoose")

const movieschema = new mongoose.Schema({
    title: { type: String, required: true },
    director: { type: String, default: "Unknown" },
    genre: { type: String, default: "Unknown" },
    duration: { type: Number, default: 0 },
    tmdbId: { type: Number, unique: true, sparse: true },
    poster: { type: String, default: null },
    backdrop: { type: String, default: null },
    overview: { type: String, default: null },
    releaseYear: { type: String, default: null },
    language: { type: String, default: null }
})

const moviemodel = mongoose.model("movie", movieschema)
module.exports = moviemodel