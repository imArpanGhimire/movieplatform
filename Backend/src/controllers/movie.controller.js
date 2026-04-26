const moviemodel = require("../models/movie.model")

async function createmovie(req, res) {


    try {
        const { title, genre, director, duration } = req.body



        if (!title || !director || !genre || !duration) {
            return res.status(400).json({
                message: "all fields are required"
            })
        }
        if (req.user.role !== "maker") {
            return res.status(403).json({
                message: "only makers can create movies"
            })
        }


        const movie = await moviemodel.create({
            title,
            director,
            genre, duration
        })

        return res.status(201).json({
            message: "movie created successfully",
            // movie: {
            //     title,
            //     director,
            //     genre,
            //     duration
            // }
            movie
        })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "internal server error"
        })
    }

}

async function getmovies(req, res) {
    try {
        const { genre, director, title } = req.params

        const filter = {}

        if (genre !== "all") {
            filter.genre = { $regex: genre, $options: "i" }  // Case-insensitive
        }
        if (director !== "all") {
            filter.director = { $regex: director, $options: "i" }  // Case-insensitive
        }

        if (title && title !== "all") {  // Add title filter
            filter.title = { $regex: title, $options: "i" }
        }
        // console.log("params:", req.params)
        // console.log("filter:", filter)

        const movies = await moviemodel.find(filter)

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

async function getmoviebyid(req, res) {
    try {
        const { id } = req.params

        const movie = await moviemodel.findById(id)

        if (!movie) {
            return res.status(404).json({
                message: "cant find that specific movie "
            })
        }

        return res.status(200).json({
            message: "movie found of that id",
            movie
        })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "internal server error"
        })
    }
}



module.exports = { createmovie, getmovies, getmoviebyid }