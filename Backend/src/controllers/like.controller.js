const likemodel = require("../models/likeModel")

const togglelike = async (req, res) => {
    try {
        const { reviewId } = req.body
        const userId = req.user.id

        // check if already liked
        const existing = await likemodel.findOne({
            review: reviewId,
            user: userId
        })

        // if already liked → remove
        if (existing) {
            await likemodel.findByIdAndDelete(existing._id)

            const count = await likemodel.countDocuments({ review: reviewId })

            return res.json({
                liked: false,
                likesCount: count
            })
        }

        // if not liked → add
        await likemodel.create({
            review: reviewId,
            user: userId
        })

        const count = await likemodel.countDocuments({ review: reviewId })

        res.json({
            liked: true,
            likesCount: count
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "error in like" })
    }
}

module.exports = { togglelike }