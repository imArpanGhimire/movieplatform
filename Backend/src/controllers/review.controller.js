const moviemodel = require("../models/movie.model")
const reviewmodel = require("../models/review.model")

async function addreview(req, res) {
    try {

        const { movieid, comment, rating, userid } = req.body

        const movie = await moviemodel.findById(movieid)
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" })
        }
        const review = await reviewmodel.create({
            movie: movie._id,
            comment,
            rating,
            user: userid
        })

        return res.status(201).json({
            message: "Review added successfully",
            review
        })


    }

    catch (e) {
        console.log(e)
        return res.status(500).json({ message: "catch block ko error" })
    }
}

async function getreviews(req, res) {
    try {

        const { movieid } = req.query
        const filter = {}
        if (movieid) filter.movie = movieid


        const allreviews = await reviewmodel.find(filter, "-_id -__v").populate("user", "username -_id")
            .populate("movie", "title -_id")

        if (!allreviews || allreviews.length === 0) {
            return res.status(403).json({
                message: "no reviews yet."
            })
        }
        return res.status(200).json({
            message: "all reviews fetched",
            allreviews
        })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "server error"
        })
    }
}

module.exports = { addreview, getreviews }