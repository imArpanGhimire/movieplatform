const express = require("express")
const router = express.Router()
const moviecontroller = require("../controllers/movie.controller")
const reviewcontroller = require("../controllers/review.controller")
const authmiddlewares = require("../middlewares/auth.middleware")

router.post("/createmovie", authmiddlewares, moviecontroller.createmovie)
router.get("/getmovies", moviecontroller.getmovies)
router.post("/addreview", authmiddlewares, reviewcontroller.addreview)
router.get("/getreviews", reviewcontroller.getreviews)

module.exports = router