const express = require("express")
const router = express.Router()
const authcontroller = require("../controllers/auth.controller")

router.post("/register", authcontroller.registeruser)
router.get("/getusers", authcontroller.getusers)

module.exports = router