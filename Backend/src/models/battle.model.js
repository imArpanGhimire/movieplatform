const mongoose = require("mongoose");

const battleMovieSchema = new mongoose.Schema(
    {
        tmdbId: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        poster: {
            type: String,
            required: true,
        },
        releaseDate: {
            type: String,
        },
        rating: {
            type: Number,
        },
    },
    { _id: false }
);

const battleVoteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        selectedMovie: {
            type: String,
            enum: ["movieA", "movieB"],
            required: true,
        },
    },
    { timestamps: true }
);

const battleSchema = new mongoose.Schema(
    {
        movieA: {
            type: battleMovieSchema,
            required: true,
        },
        movieB: {
            type: battleMovieSchema,
            required: true,
        },
        battleDate: {
            type: String,
            required: true,
        },
        votes: [battleVoteSchema],
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

const Battle = mongoose.model("battle", battleSchema);

module.exports = Battle;