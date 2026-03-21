const moviemodel = require("../models/movie.model")

async function createmovie(req, res) {


    try {
        const { title, genre, director, timespan } = req.body

        const currentuser = {
            role: "maker"
        }

        if (currentuser.role !== "maker") {
            return res.status(403).json({
                message: "only makers can create movies"
            })
        }

        const movie = await moviemodel.create({
            title,
            director,
            genre, timespan
        })

        res.status(201).json({
            message: "movie created successfully",
            movie: {
                title,
                director,
                genre,
                timespan
            }
        })
    }
    catch (e) {
        console.log(e)
    }

}


async function getmovies(req, res) {

    try {

        const { genre, director } = req.query

        const filter = {}
        if (genre) filter.genre = genre
        if (director) filter.director = director


        const movies = await moviemodel.find(filter
            // todo genre matra filter garne bela
            // genre ? { genre } : {}
        )

        if (!movies || movies.length === 0) {
            return res.status(404).json({
                message: "movies doesnt exist"
            })
        }

        return res.status(200).json({
            message: "movies fetched successfully",
            movies
        })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "server error"
        })
    }
}

module.exports = { createmovie, getmovies }