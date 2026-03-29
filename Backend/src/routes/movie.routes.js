const express = require("express")
const router = express.Router()
const moviecontroller = require("../controllers/movie.controller")
const reviewcontroller = require("../controllers/review.controller")
const authmiddlewares = require("../middlewares/auth.middleware")

router.post("/createmovie", authmiddlewares, moviecontroller.createmovie)
router.get("/getmovies/:genre/:director/:title", authmiddlewares, moviecontroller.getmovies)
router.get("/getmoviebyid/:id", authmiddlewares, moviecontroller.getmoviebyid)
router.post("/addreview", authmiddlewares, reviewcontroller.addreview)
router.get("/getreviews/:movieid", authmiddlewares, reviewcontroller.getreviews)
router.put("/review/:id", authmiddlewares, reviewcontroller.editreviews)
router.delete("/review/:id", authmiddlewares, reviewcontroller.deletereviews)

module.exports = router