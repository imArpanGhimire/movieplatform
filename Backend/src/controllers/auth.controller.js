const usermodel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const reviewmodel = require("../models/review.model");

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

async function registeruser(req, res) {
    try {
        const username = req.body.username?.trim().toLowerCase();
        const { password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        if (username.length < 3 || username.length > 20) {
            return res.status(400).json({ message: "Username must be 3–20 characters" });
        }

        if (!/^[a-z0-9_]+$/.test(username)) {
            return res.status(400).json({ message: "Username can only contain letters, numbers, and underscores" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const userExists = await usermodel.findOne({ username });
        if (userExists) {
            return res.status(409).json({ message: "Another user with that name exists" });
        }

        const hash = await bcrypt.hash(password, 10);
        const user = await usermodel.create({ username, password: hash });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, cookieOptions);

        return res.status(201).json({
            message: "User created successfully",
            user: { username },
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function loginuser(req, res) {
    try {
        const username = req.body.username?.trim().toLowerCase();
        const { password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const user = await usermodel.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const pswcheck = await bcrypt.compare(password, user.password);
        if (!pswcheck) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, cookieOptions);

        return res.status(200).json({
            message: "Logged in successfully",
            user: {
                id: user._id,
                username: user.username,
            },
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal server error" });
    }
}

function logoutuser(req, res) {
    res.clearCookie("token", cookieOptions);
    return res.status(200).json({ message: "Logged out successfully" });
}

async function me(req, res) {
    try {
        const user = await usermodel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "User is logged in",
            user: {
                _id: user._id,
                id: user._id,
                username: user.username,
            },
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function getProfile(req, res) {
    try {
        const user = await usermodel.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const reviews = await reviewmodel
            .find({ user: req.user.id })
            .populate("movie", "title")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Profile fetched",
            user,
            reviews,
            stats: {
                totalReviews: reviews.length,
                totalLikedMovies: user.likedMovies.length,
            },
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { registeruser, loginuser, logoutuser, me, getProfile };