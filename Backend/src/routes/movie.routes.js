const express = require("express")
const router = express.Router()
const moviecontroller = require("../controllers/movie.controller")
const reviewcontroller = require("../controllers/review.controller")
const authmiddlewares = require("../middlewares/auth.middleware")

router.post("/createmovie", authmiddlewares, moviecontroller.createmovie)
router.get("/getmovies/:genre/:director/:title", authmiddlewares, moviecontroller.getmovies)
router.post("/addreview", authmiddlewares, reviewcontroller.addreview)
router.get("/getreviews/:movieid", authmiddlewares, reviewcontroller.getreviews)
router.get("/getmoviebyid/:id", authmiddlewares, moviecontroller.getmoviebyid)

module.exports = router