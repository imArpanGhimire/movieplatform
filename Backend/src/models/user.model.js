const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            minlength: 3,
            maxlength: 20,
        },
        password: {
            type: String,
            required: true,
        },
        secretKeyHash: {
            type: String,
            default: null,
        },
        hasSecretKey: {
            type: Boolean,
            default: false,
        },
        savedMovies: [
            {
                tmdbId: { type: String, required: true },
                title: String,
                poster: String,
                releaseDate: String,
                rating: Number,
            },
        ],
        likedMovies: [
            {
                tmdbId: { type: String, required: true },
                title: String,
                poster: String,
                releaseDate: String,
                rating: Number,
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);