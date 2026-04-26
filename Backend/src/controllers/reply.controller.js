import Reply from "../models/reply.model.js";

export const addReply = async (req, res) => {
    try {
        const { reviewId, text } = req.body;

        const reply = await Reply.create({
            review: reviewId,
            user: req.user.id,
            text,
        });

        const populated = await Reply.findById(reply._id).populate(
            "user",
            "username"
        );

        res.status(201).json(populated);
    } catch (err) {
        res.status(500).json({ message: "Failed to add reply" });
    }
};

export const getReplies = async (req, res) => {
    try {
        const { reviewId } = req.params;

        const replies = await Reply.find({ review: reviewId })
            .populate("user", "username")
            .sort({ createdAt: 1 });

        res.json(replies);
    } catch {
        res.status(500).json({ message: "Failed to fetch replies" });
    }
};

export const deleteReply = async (req, res) => {
    try {
        const reply = await Reply.findById(req.params.id);

        if (reply.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not allowed" });
        }

        await reply.deleteOne();

        res.json({ message: "Deleted" });
    } catch {
        res.status(500).json({ message: "Failed" });
    }
};