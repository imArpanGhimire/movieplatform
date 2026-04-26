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

        if (!query) {
            return res.status(400).json({ message: "Query is required" })
        }

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

// POST /api/tmdb/save  body: { tmdbId }
async function savemovie(req, res) {
    try {
        const { tmdbId } = req.body

        if (!tmdbId) {
            return res.status(400).json({ message: "tmdbId is required" })
        }

        // already in our db? just return it
        const existing = await moviemodel.findOne({ tmdbId })
        if (existing) {
            return res.status(200).json({ movie: existing })
        }

        // fetch movie details from tmdb
        const movieRes = await fetch(`${TMDB_BASE}/movie/${tmdbId}?language=en-US`, { headers })
        const movieData = await movieRes.json()

        // fetch credits to get director name
        const creditsRes = await fetch(`${TMDB_BASE}/movie/${tmdbId}/credits`, { headers })
        const creditsData = await creditsRes.json()

        const director = creditsData.crew?.find((p) => p.job === "Director")?.name || "Unknown"
        const genre = movieData.genres?.[0]?.name || "Unknown"
        const duration = movieData.runtime ? Math.round((movieData.runtime / 60) * 10) / 10 : 0

        const newMovie = await moviemodel.create({
            tmdbId: movieData.id,
            title: movieData.title,
            director,
            genre,
            duration,
            poster: movieData.poster_path ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}` : null,
            backdrop: movieData.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movieData.backdrop_path}` : null,
            overview: movieData.overview || null,
            releaseYear: movieData.release_date ? movieData.release_date.split("-")[0] : null,
            language: movieData.original_language || null
        })

        return res.status(201).json({ movie: newMovie })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "Failed to save movie" })
    }
}

module.exports = { searchtmdb, savemovie }