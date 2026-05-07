const axios = require("axios");
const User = require("../models/user.model");

const tmdb = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    headers: {
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`
    },
});

const getPersonalizedHome = async (req, res) => {
    try {
        const userid = req.user.id;

        const user = await User.findById(userid);

        if (!user) {
            return res.status(404).json({
                message: "user not found",
            });
        }

        const savedMovies = user.savedMovies || [];

        let genreIds = [];

        // collect all genre ids from saved movies
        savedMovies.forEach((movie) => {
            if (movie.genre_ids) {
                genreIds.push(...movie.genre_ids);
            }
        });

        // remove duplicate genres
        genreIds = [...new Set(genreIds)];

        // only take first 3 genres
        genreIds = genreIds.slice(0, 3);

        let favoriteGenreMovies = [];

        // get movies from favorite genres
        for (let genreId of genreIds) {
            const response = await tmdb.get("/discover/movie", {
                params: {
                    with_genres: genreId,
                },
            });

            favoriteGenreMovies.push(...response.data.results);
        }

        let becauseYouSaved = [];

        // get recommendations from saved movies
        for (let movie of savedMovies.slice(0, 3)) {
            if (movie.tmdbId) {
                const response = await tmdb.get(
                    `/movie/${movie.tmdbId}/recommendations`
                );

                becauseYouSaved.push(...response.data.results);
            }
        }

        // trending movies
        const trendingResponse = await tmdb.get("/trending/movie/week");

        return res.status(200).json({
            success: true,

            sections: {
                trending: trendingResponse.data.results,

                becauseYouSaved: becauseYouSaved.slice(0, 12),

                favoriteGenrePicks: favoriteGenreMovies.slice(0, 12),
            },
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "server error",
        });
    }
};

module.exports = {
    getPersonalizedHome,
};