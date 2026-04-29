const User = require("../models/user.model");

async function saveMovie(req, res) {
    try {
        const { tmdbId, title, poster, releaseDate, rating } = req.body;

        if (!tmdbId || !title) {
            return res.status(400).json({
                message: "Movie id and title are required",
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const alreadySaved = user.savedMovies.some(
            (movie) => movie.tmdbId === String(tmdbId)
        );

        if (alreadySaved) {
            return res.status(400).json({
                message: "Movie already saved",
            });
        }

        user.savedMovies.push({
            tmdbId: String(tmdbId),
            title,
            poster,
            releaseDate,
            rating,
        });

        await user.save();

        return res.status(200).json({
            message: "Movie saved successfully",
            savedMovies: user.savedMovies,
        });
    } catch (e) {
        console.log(e);

        return res.status(500).json({
            message: "Failed to save movie",
        });
    }
}

async function getSavedMovies(req, res) {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            movies: user.savedMovies,
        });
    } catch (e) {
        console.log(e);

        return res.status(500).json({
            message: "Failed to get saved movies",
        });
    }
}

async function removeSavedMovie(req, res) {
    try {
        const { tmdbId } = req.params;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        user.savedMovies = user.savedMovies.filter(
            (movie) => movie.tmdbId !== String(tmdbId)
        );

        await user.save();

        return res.status(200).json({
            message: "Movie removed from saved list",
            savedMovies: user.savedMovies,
        });
    } catch (e) {
        console.log(e);

        return res.status(500).json({
            message: "Failed to remove saved movie",
        });
    }
}

module.exports = {
    saveMovie,
    getSavedMovies,
    removeSavedMovie,
};