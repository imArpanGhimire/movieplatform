const express = require("express")
const router = express.Router()
const { searchtmdb, savemovie } = require("../controllers/tmdb.controller")
const authmiddlewares = require("../middlewares/auth.middleware")

router.get("/search", authmiddlewares, searchtmdb)
router.post("/save", authmiddlewares, savemovie)

module.exports = router