const moviemodel = require("../models/movie.model")

const TMDB_BASE = "https://api.themoviedb.org/3"
const TMDB_TOKEN = process.env.TMDB_TOKEN

const tmdbHeaders = {
    Authorization: `Bearer ${TMDB_TOKEN}`,
    "Content-Type": "application/json"
}

// ── Search TMDB ──────────────────────────────────────────────
// GET /api/tmdb/search?query=inception
async function searchtmdb(req, res) {
    try {
        const { query } = req.query

        if (!query || query.trim() === "") {
            return res.status(400).json({ message: "Query is required" })
        }

        const response = await fetch(
            `${TMDB_BASE}/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`,
            { headers: tmdbHeaders }
        )

        const data = await response.json()

        if (!response.ok) {
            return res.status(response.status).json({ message: "TMDB search failed" })
        }

        // Shape the results — only send what we need to frontend
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
            releaseYear: m.release_date ? m.release_date.split("-")[0] : null,
            language: m.original_language,
            genre: null  // TMDB returns genre_ids not names in search — filled on detail fetch
        }))

        return res.status(200).json({ movies })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "Failed to search TMDB" })
    }
}

// ── Save or fetch a TMDB movie into your DB ──────────────────
// POST /api/tmdb/save
// Body: { tmdbId }
// Call this when user opens a movie detail page
// If already in DB, just return it. If not, fetch from TMDB and save it.
async function saveormovie(req, res) {
    try {
        const { tmdbId } = req.body

        if (!tmdbId) {
            return res.status(400).json({ message: "tmdbId is required" })
        }

        // Already in DB? Return it
        const existing = await moviemodel.findOne({ tmdbId })
        if (existing) {
            return res.status(200).json({ movie: existing })
        }

        // Fetch full details from TMDB
        const response = await fetch(`${TMDB_BASE}/movie/${tmdbId}?language=en-US`, {
            headers: tmdbHeaders
        })

        const data = await response.json()

        if (!response.ok) {
            return res.status(response.status).json({ message: "Failed to fetch movie from TMDB" })
        }

        // Get director from credits
        const creditsRes = await fetch(`${TMDB_BASE}/movie/${tmdbId}/credits`, {
            headers: tmdbHeaders
        })
        const creditsData = await creditsRes.json()
        const director =
            creditsData.crew?.find((p) => p.job === "Director")?.name || "Unknown"

        // Map genre
        const genre = data.genres?.[0]?.name || "Unknown"

        // Duration in hours
        const duration = data.runtime ? Math.round(data.runtime / 60 * 10) / 10 : 0

        const newMovie = await moviemodel.create({
            tmdbId: data.id,
            title: data.title,
            director,
            genre,
            duration,
            poster: data.poster_path
                ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
                : null,
            backdrop: data.backdrop_path
                ? `https://image.tmdb.org/t/p/w1280${data.backdrop_path}`
                : null,
            overview: data.overview || null,
            releaseYear: data.release_date ? data.release_date.split("-")[0] : null,
            language: data.original_language || null
        })

        return res.status(201).json({ movie: newMovie })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ message: "Failed to save movie" })
    }
}

module.exports = { searchtmdb, saveormovie }