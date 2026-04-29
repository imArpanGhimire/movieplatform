const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        enum: ["user", "maker"],
        default: "user",
    },

    savedMovies: [
        {
            tmdbId: {
                type: String,
                required: true,
            },
            title: String,
            poster: String,
            releaseDate: String,
            rating: Number,
        },
    ],
});

module.exports = mongoose.model("User", userSchema);