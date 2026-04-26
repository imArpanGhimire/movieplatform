const moviemodel = require("../models/movie.model")

const TMDB_BASE = "https://api.themoviedb.org/3"

const headers = {
    Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    "Content-Type": "application/json"
}

// GET /api/tmdb/search?query=inception
async function searchtmdb(req, res) {
    try {
        const { query } = req.query
        if (!query) return res.status(400).json({ message: "Query is required" })

        const response = await fetch(`${TMDB_BASE}/search/movie?query=${encodeURIComponent(query)}&language=en-US`, { headers })
        const data = await response.json()

        const movies = data.results.slice(0, 12).map((m) => ({
            tmdbId: m.id,
            title: m.title,
            overview: m.overview,
            poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
            backdrop: m.backdrop_path ? `https://image.tmdb.org/t/p/w1280${m.backdrop_path}` : null,
            releaseYear: m.release_date ? m.release_date.split("-")[0] : null,
            language: m.original_language
        }))

        return res.status(200).json({ movies })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "Failed to search TMDB" })
    }
}


async function searchByDirector(req, res) {
    try {
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({ message: "Director name is required" });
        }

        const personRes = await fetch(
            `${TMDB_BASE}/search/person?query=${encodeURIComponent(name)}&language=en-US`,
            { headers }
        );

        const personData = await personRes.json();
        const person = personData.results?.[0];

        if (!person) {
            return res.status(200).json({ movies: [] });
        }

        const creditsRes = await fetch(
            `${TMDB_BASE}/person/${person.id}/movie_credits?language=en-US`,
            { headers }
        );

        const creditsData = await creditsRes.json();

        const directedMovies = creditsData.crew
            ?.filter((item) => item.job === "Director")
            .slice(0, 20)
            .map((m) => ({
                tmdbId: m.id,
                title: m.title,
                overview: m.overview,
                poster: m.poster_path
                    ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
                    : null,
                backdrop: m.backdrop_path
                    ? `https://image.tmdb.org/t/p/w1280${m.backdrop_path}`
                    : null,
                releaseYear: m.release_date ? m.release_date.split("-")[0] : null,
                language: m.original_language,
            })) || [];

        return res.status(200).json({ movies: directedMovies });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Failed to search by director" });
    }
}

// POST /api/tmdb/save  body: { tmdbId }
async function savemovie(req, res) {
    try {
        const { tmdbId } = req.body
        if (!tmdbId) return res.status(400).json({ message: "tmdbId is required" })

        // fetch movie details from tmdb
        const movieRes = await fetch(`${TMDB_BASE}/movie/${tmdbId}?language=en-US`, { headers })
        const movieData = await movieRes.json()

        // fetch credits to get director
        const creditsRes = await fetch(`${TMDB_BASE}/movie/${tmdbId}/credits`, { headers })
        const creditsData = await creditsRes.json()

        const director = creditsData.crew?.find((p) => p.job === "Director")?.name || "Unknown"
        const genre = movieData.genres?.[0]?.name || "Unknown"
        const duration = movieData.runtime ? Math.round((movieData.runtime / 60) * 10) / 10 : 0

        // upsert — if movie exists return it, if not create it
        // $setOnInsert only writes fields when creating, never overwrites existing doc
        const movie = await moviemodel.findOneAndUpdate(
            { tmdbId },
            {
                $setOnInsert: {
                    tmdbId,
                    title: movieData.title,
                    director,
                    genre,
                    duration,
                    poster: movieData.poster_path ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}` : null,
                    backdrop: movieData.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movieData.backdrop_path}` : null,
                    overview: movieData.overview || null,
                    releaseYear: movieData.release_date ? movieData.release_date.split("-")[0] : null,
                    language: movieData.original_language || null
                }
            },
            { upsert: true, new: true }
        )

        return res.status(200).json({ movie })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "Failed to save movie" })
    }
}


async function topRatedMovies(req, res) {
    try {
        const response = await fetch(
            `${TMDB_BASE}/movie/top_rated?language=en-US&page=1`,
            { headers }
        );

        const data = await response.json();

        const movies = data.results.slice(0, 12).map((m) => ({
            tmdbId: m.id,
            title: m.title,
            overview: m.overview,
            poster: m.poster_path
                ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
                : null,
            backdrop: m.backdrop_path
                ? `https://image.tmdb.org/t/p/w1280${m.backdrop_path}`
                : null,
            releaseYear: m.release_date
                ? m.release_date.split("-")[0]
                : null,
            language: m.original_language,
        }));

        return res.status(200).json({ movies });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Failed to fetch top rated movies" });
    }
}

module.exports = {
    searchtmdb,
    savemovie,
    searchByDirector,
    topRatedMovies,
};