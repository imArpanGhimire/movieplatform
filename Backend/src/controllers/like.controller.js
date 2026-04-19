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
    }
    catch (e) {
        console.log(e)
    }
}