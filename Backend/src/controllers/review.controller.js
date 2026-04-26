const moviemodel = require("../models/movie.model")
const reviewmodel = require("../models/review.model")
const likemodel = require("../models/like.model")
const replymodel = require("../models/reply.model")

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
            return res.status(404).json({
                message: "Movie not found"
            })
        }

        const review = await reviewmodel.create({
            movie: movie._id,
            comment,
            rating,
            user: req.user.id
        })

        const populatedReview = await reviewmodel
            .findById(review._id)
            .populate("user", "username _id")
            .populate("movie", "title")

        return res.status(201).json({
            message: "Review added successfully",
            review: {
                ...populatedReview.toObject(),
                likesCount: 0,
                likedByUser: false
            }
        })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "catch block ko error"
        })
    }
}

async function getreviews(req, res) {
    try {
        const { movieid } = req.params
        const filter = {}

        if (movieid) {
            filter.movie = movieid
        }

        const allreviews = await reviewmodel
            .find(filter)
            .populate("user", "username _id")
            .populate("movie", "title")
            .sort({ createdAt: -1 })

        if (!allreviews || allreviews.length === 0) {
            return res.status(200).json({
                message: "these are all the reviews as of now",
                allreviews: []
            })
        }

        const reviewswithlikes = await Promise.all(
            allreviews.map(async (review) => {
                const likesCount = await likemodel.countDocuments({
                    review: review._id
                })

                const existingLike = await likemodel.findOne({
                    review: review._id,
                    user: req.user.id
                })

                return {
                    ...review.toObject(),
                    likesCount,
                    likedByUser: !!existingLike
                }
            })
        )

        return res.status(200).json({
            message: "all reviews fetched",
            allreviews: reviewswithlikes
        })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "server error"
        })
    }
}

async function editreviews(req, res) {
    try {
        const { id } = req.params
        const { rating, comment } = req.body

        const review = await reviewmodel.findById(id)

        if (!review) {
            return res.status(404).json({
                message: "review not found"
            })
        }

        if (req.user.id !== review.user.toString()) {
            return res.status(403).json({
                message: "not authorized to update the review"
            })
        }

        const updatedReview = await reviewmodel.findByIdAndUpdate(
            id,
            { rating, comment, isEdited: true },
            { returnDocument: "after" }
        )
            .populate("user", "username _id")
            .populate("movie", "title")

        const likesCount = await likemodel.countDocuments({
            review: updatedReview._id
        })

        const existingLike = await likemodel.findOne({
            review: updatedReview._id,
            user: req.user.id
        })

        return res.status(200).json({
            message: "Review updated successfully",
            review: {
                ...updatedReview.toObject(),
                likesCount,
                likedByUser: !!existingLike
            }
        })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Server error"
        })
    }
}

async function deletereviews(req, res) {
    try {
        const { id } = req.params

        const review = await reviewmodel.findById(id)

        if (!review) {
            return res.status(404).json({
                message: "Review not found"
            })
        }

        if (review.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You can't delete the reviews posted by others."
            })
        }

        await likemodel.deleteMany({ review: id })
        await reviewmodel.findByIdAndDelete(id)
        await replymodel.deleteMany({ review: id })

        return res.status(200).json({
            message: "Review deleted successfully"
        })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Server error"
        })
    }
}

async function averagerating(req, res) {
    try {
        const { movieid } = req.params
        const reviews = await reviewmodel.find({ movie: movieid })

        if (reviews.length === 0) {
            return res.status(200).json({
                message: "No reviews yet",
                averageRating: 0
            })
        }

        const totalrating = reviews.reduce((sum, review) => sum + Number(review.rating), 0)
        const averageratingvalue = (totalrating / reviews.length).toFixed(1)

        return res.status(200).json({
            message: "average rating fetched",
            averageRating: averageratingvalue
        })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Server error"
        })
    }
}

module.exports = {
    addreview,
    getreviews,
    editreviews,
    deletereviews,
    averagerating
}