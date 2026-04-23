const likemodel = require("../models/like.model")

const liketoggle = async (req, res) => {
    try {
        const { reviewid } = req.body
        const userid = req.user.id

        if (!reviewid) {
            return res.status(400).json({
                message: "review id is required"
            })
        }

        const existing = await likemodel.findOne({
            review: reviewid,
            user: userid
        })

        if (existing) {
            await existing.deleteOne()

            const count = await likemodel.countDocuments({
                review: reviewid
            })

            return res.json({
                liked: false,
                likesCount: count,
                message: "Like removed"
            })
        }

        await likemodel.create({
            review: reviewid,
            user: userid
        })

        const count = await likemodel.countDocuments({
            review: reviewid
        })

        return res.json({
            liked: true,
            likesCount: count,
            message: "Like added"
        })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Failed to toggle like"
        })
    }
}

module.exports = { liketoggle }