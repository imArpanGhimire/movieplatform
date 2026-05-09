const axios = require("axios");
const User = require("../models/user.model");

const tmdb = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    headers: {
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    },
});

const getPersonalizedHome = async (req, res) => {
    try {
        const userid = req.user.id;
        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        const savedMovies = user.savedMovies || [];

        // ── Determine which genre IDs to use ──────────────────────────
        // Priority 1: genres the user explicitly picked in the modal
        // Priority 2: genres inferred from their saved movies
        let genreIds = [];

        if (req.query.genres) {
            // User picked genres via the modal — trust this over everything
            genreIds = req.query.genres
                .split(",")
                .map((id) => parseInt(id))
                .filter(Boolean);
        } else {
            // Fall back to saved movie genres
            savedMovies.forEach((movie) => {
                if (movie.genre_ids) genreIds.push(...movie.genre_ids);
            });
            genreIds = [...new Set(genreIds)].slice(0, 3);
        }

        // ── Favorite genre picks ───────────────────────────────────────
        // Fetch movies for ALL selected genres combined (one request, more accurate)
        let favoriteGenreMovies = [];
        if (genreIds.length > 0) {
            const response = await tmdb.get("/discover/movie", {
                params: {
                    with_genres: genreIds.join(","), // AND logic: matches all selected genres
                    sort_by: "vote_average.desc",
                    "vote_count.gte": 200,           // filter out obscure low-vote films
                    page: 1,
                },
            });
            favoriteGenreMovies = response.data.results;

            // If AND logic returns too few results, fall back to OR logic (|)
            if (favoriteGenreMovies.length < 6 && genreIds.length > 1) {
                const fallback = await tmdb.get("/discover/movie", {
                    params: {
                        with_genres: genreIds.join("|"), // OR logic
                        sort_by: "vote_average.desc",
                        "vote_count.gte": 200,
                        page: 1,
                    },
                });
                favoriteGenreMovies = fallback.data.results;
            }
        }

        // ── Because you saved ──────────────────────────────────────────
        let becauseYouSaved = [];
        for (let movie of savedMovies.slice(0, 3)) {
            if (movie.tmdbId) {
                const response = await tmdb.get(
                    `/movie/${movie.tmdbId}/recommendations`
                );
                becauseYouSaved.push(...response.data.results);
            }
        }

        // Remove duplicates from becauseYouSaved by tmdb id
        const seen = new Set();
        becauseYouSaved = becauseYouSaved.filter((m) => {
            if (seen.has(m.id)) return false;
            seen.add(m.id);
            return true;
        });

        // ── Trending ───────────────────────────────────────────────────
        const trendingResponse = await tmdb.get("/trending/movie/week");

        return res.status(200).json({
            success: true,
            // Echo back which genres are active so frontend can show them
            activeGenres: genreIds,
            sections: {
                trending: trendingResponse.data.results,
                becauseYouSaved: becauseYouSaved.slice(0, 12),
                favoriteGenrePicks: favoriteGenreMovies.slice(0, 12),
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "server error" });
    }
};

module.exports = { getPersonalizedHome };