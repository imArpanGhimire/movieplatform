const User = require("../models/user.model");

async function saveMovie(req, res) {
    try {
        const { tmdbId, title, poster } = req.body;

        if (!tmdbId || !title) {
            return res.status(400).json({ message: "Missing data" });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ensure array exists
        if (!Array.isArray(user.savedMovies)) {
            user.savedMovies = [];
        }

        const exists = user.savedMovies.find(
            (m) => String(m.tmdbId) === String(tmdbId)
        );

        if (exists) {
            return res.status(400).json({ message: "Already saved" });
        }

        const newMovie = {
            tmdbId: String(tmdbId),
            title: title,
            poster_path: poster || "",
        };

        user.savedMovies.push(newMovie);

        await user.save();

        return res.status(200).json({
            message: "Saved successfully",
            movies: user.savedMovies,
        });

    } catch (e) {
        console.log("SAVE ERROR 👉", e);
        return res.status(500).json({ message: "Server error" });
    }
}

async function getSavedMovies(req, res) {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            movies: user.savedMovies || [],   // 🔥 safety
        });

    } catch (e) {
        console.log("GET SAVED ERROR 👉", e);
        return res.status(500).json({ message: "Failed to get saved movies" });
    }
}

async function removeSavedMovie(req, res) {
    try {
        const { tmdbId } = req.params;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.savedMovies = (user.savedMovies || []).filter(
            (movie) => String(movie.tmdbId) !== String(tmdbId)
        );

        await user.save();

        return res.status(200).json({
            message: "Removed successfully",
            movies: user.savedMovies,
        });

    } catch (e) {
        console.log("REMOVE ERROR 👉", e);
        return res.status(500).json({ message: "Error removing movie" });
    }
}

module.exports = {
    saveMovie,
    getSavedMovies,
    removeSavedMovie,
};