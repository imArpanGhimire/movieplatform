const express = require("express");
const {
    addReply,
    getReplies,
    deleteReply,
} = require("../controllers/reply.controller");

const auth = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", auth, addReply);
router.get("/:reviewId", auth, getReplies);
router.delete("/:id", auth, deleteReply);

module.exports = router;