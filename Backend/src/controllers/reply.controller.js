const Reply = require("../models/reply.model");

const addReply = async (req, res) => {
    try {
        const { reviewId, text } = req.body;

        if (!reviewId || !text) {
            return res.status(400).json({
                message: "Review ID and reply text are required",
            });
        }

        const reply = await Reply.create({
            review: reviewId,
            user: req.user.id,
            text,
        });

        const populated = await Reply.findById(reply._id).populate(
            "user",
            "username"
        );

        return res.status(201).json(populated);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to add reply" });
    }
};

const getReplies = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const replies = await Reply.find({ review: reviewId })
            .populate("user", "username")
            .sort({ createdAt: 1 });

        return res.json(replies);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed to fetch replies" });
    }
};

const deleteReply = async (req, res) => {
    try {
        const reply = await Reply.findById(req.params.id);

        if (!reply) {
            return res.status(404).json({ message: "Reply not found" });
        }

        if (reply.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not allowed" });
        }

        await reply.deleteOne();

        return res.json({ message: "Deleted" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Failed" });
    }
};

module.exports = {
    addReply,
    getReplies,
    deleteReply,
};