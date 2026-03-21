const express = require("express")
const router = express.Router()
const moviecontroller = require("../controllers/movie.controller")
const reviewcontroller = require("../controllers/review.controller")

router.post("/createmovie", moviecontroller.createmovie)
router.get("/getmovies", moviecontroller.getmovies)
router.post("/addreview", reviewcontroller.addreview)
router.get("/getreviews", reviewcontroller.getreviews)

module.exports = router