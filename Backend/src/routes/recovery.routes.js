const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const verifyToken = require("../middlewares/auth.middleware");

const router = express.Router();

// POST /recovery/set-secret
router.post("/set-secret", verifyToken, async (req, res) => {
    try {
        const { secretKey } = req.body;

        if (!secretKey || secretKey.trim().length < 6) {
            return res.status(400).json({
                message: "Secret key must be at least 6 characters.",
            });
        }

        const user = await User.findById(req.user.id);

        if (user.hasSecretKey) {
            return res.status(400).json({
                message: "Secret key already set.",
            });
        }

        const hash = await bcrypt.hash(secretKey.trim(), 10);

        await User.findByIdAndUpdate(req.user.id, {
            secretKeyHash: hash,
            hasSecretKey: true,
        });

        res.json({ message: "Secret key saved." });

    } catch (e) {
        res.status(500).json({ message: "Server error." });
    }
});

// POST /recovery/verify-secret
router.post("/verify-secret", async (req, res) => {
    try {
        const { username, secretKey } = req.body;

        const user = await User.findOne({
            username: username.toLowerCase().trim(),
        });

        if (!user || !user.hasSecretKey) {
            return res.status(404).json({
                message: "User not found or no secret key set.",
            });
        }

        const match = await bcrypt.compare(
            secretKey.trim(),
            user.secretKeyHash
        );

        if (!match) {
            return res.status(401).json({
                message: "Incorrect secret key.",
            });
        }

        res.json({
            message: "Verified.",
            userId: user._id,
        });

    } catch (e) {
        res.status(500).json({ message: "Server error." });
    }
});

// POST /recovery/reset-password
router.post("/reset-password", async (req, res) => {
    try {
        const { userId, newPassword } = req.body;

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters.",
            });
        }

        const hash = await bcrypt.hash(newPassword, 10);

        await User.findByIdAndUpdate(userId, {
            password: hash,
        });

        res.json({
            message: "Password reset successfully.",
        });

    } catch (e) {
        res.status(500).json({ message: "Server error." });
    }
});

module.exports = router;