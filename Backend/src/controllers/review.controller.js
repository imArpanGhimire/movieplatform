const moviemodel = require("../models/movie.model")
const reviewmodel = require("../models/review.model")

async function addreview(req, res) {
    try {

        const { movieid, comment, rating } = req.body

        if (!movieid || !comment || !rating) {
            return res.status(400).json({
                message: "movieid, comment and rating are required"
            })
        }

        const movie = await moviemodel.findById(movieid)
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" })
        }
        const review = await reviewmodel.create({
            movie: movie._id,
            comment,
            rating,
            user: req.user.id
        })

        const populatedReview = await reviewmodel
            .findById(review._id)
            .populate("user", "username")
            .populate("movie", "title")


        return res.status(201).json({
            message: "Review added successfully",
            review: populatedReview
        })


    }

    catch (e) {
        console.log(e)
        return res.status(500).json({ message: "catch block ko error" })
    }
}

async function getreviews(req, res) {
    try {

        const { movieid } = req.params
        const filter = {}
        if (movieid) filter.movie = movieid

        const allreviews = await reviewmodel.find(filter).populate("user", "username")
            .populate("movie", "title")

        if (!allreviews || allreviews.length === 0) {
            return res.status(200).json({
                message: "these are all the reviews as of now",
                allreviews: []
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