const express = require("express")
const router = express.Router()

const {
    searchtmdb,
    savemovie,
    searchByDirector,
    topRatedMovies,
} = require("../controllers/tmdb.controller");

const authmiddlewares = require("../middlewares/auth.middleware")

router.get("/search", authmiddlewares, searchtmdb)
router.get("/director", authmiddlewares, searchByDirector)
router.post("/save", authmiddlewares, savemovie)
router.get("/toprated", authmiddlewares, topRatedMovies);

module.exports = router