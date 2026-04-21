const likemodel = require("../models/like.model")

const liketoggle = async (req, res) => {
    try {
        const { reviewid } = req.body
        const userid = req.user.id

        const existing = await likemodel.findOne({
            review: reviewid,
            user: userid
        })

        console.log(existing)

        if (existing) {
            await likemodel.findByIdAndDelete(existing._id)
            return res.json({ message: "Like removed" })
        } else {
            const newLike = await likemodel.create({
                review: reviewid,
                user: userid
            })
            return res.json({ message: "Like added", like: newLike })
        }
    }
    catch (e) {
        res.status(500).json({ error: "Failed to toggle like" })
    }
}

module.exports = { liketoggle }