const express = require("express")
const router = express.Router()

const { liketoggle } = require("../controllers/like.controller")
const auth = require("../middlewares/auth.middleware")

router.post("/likes", auth, liketoggle)

module.exports = router