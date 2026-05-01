const express = require("express");
const auth = require("../middlewares/auth.middleware");

const {
    saveMovie,
    getSavedMovies,
    removeSavedMovie,
    toggleLike // 👈 ADD THIS
} = require("../controllers/saved.controller");

const router = express.Router();

router.post("/", auth, saveMovie);
router.get("/", auth, getSavedMovies);
router.delete("/:tmdbId", auth, removeSavedMovie);

// ❤️ LIKE ROUTE
router.post("/like", auth, toggleLike);

module.exports = router;