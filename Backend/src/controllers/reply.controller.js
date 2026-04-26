const Reply = require("../models/reply.model");

function buildReplyTree(replies) {
    const replyMap = {};
    const rootReplies = [];

    replies.forEach((reply) => {
        replyMap[reply._id] = {
            ...reply.toObject(),
            children: [],
        };
    });

    replies.forEach((reply) => {
        if (reply.parentReply) {
            const parent = replyMap[reply.parentReply.toString()];

            if (parent) {
                parent.children.push(replyMap[reply._id]);
            }
        } else {
            rootReplies.push(replyMap[reply._id]);
        }
    });

    return rootReplies;
}

const addReply = async (req, res) => {
    try {
        const { reviewId, text, parentReply } = req.body;

        if (!reviewId || !text) {
            return res.status(400).json({
                message: "Review ID and reply text are required",
            });
        }

        const reply = await Reply.create({
            review: reviewId,
            user: req.user.id,
            text,
            parentReply: parentReply || null,
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

        const nestedReplies = buildReplyTree(replies);

        return res.json(nestedReplies);
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

        await Reply.deleteMany({
            $or: [{ _id: reply._id }, { parentReply: reply._id }],
        });

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