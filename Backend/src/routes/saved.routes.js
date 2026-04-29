const express = require("express");
const auth = require("../middlewares/auth.middleware");

const {
    saveMovie,
    getSavedMovies,
    removeSavedMovie,
} = require("../controllers/saved.controller");

const router = express.Router();

router.post("/", auth, saveMovie);
router.get("/", auth, getSavedMovies);
router.delete("/:tmdbId", auth, removeSavedMovie);

module.exports = router;