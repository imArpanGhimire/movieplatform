const express = require("express")
const router = express.Router()
const { searchtmdb, savemovie } = require("../controllers/tmdb.controller")
const authmiddlewares = require("../middlewares/auth.middleware")
const { searchtmdb, savemovie, searchByDirector } = require("../controllers/tmdb.controller");

router.get("/search", authmiddlewares, searchtmdb)
router.post("/save", authmiddlewares, savemovie)

router.get("/director", authmiddlewares, searchByDirector);

module.exports = router