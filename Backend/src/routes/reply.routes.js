import express from "express";
import {
    addReply,
    getReplies,
    deleteReply,
} from "../controllers/reply.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", auth, addReply);
router.get("/:reviewId", auth, getReplies);
router.delete("/:id", auth, deleteReply);

export default router;