const express = require("express")
const router = express.Router()
const authcontroller = require("../controllers/auth.controller")

router.post("/register", authcontroller.registeruser)
router.get("/getusers", authcontroller.getusers)
router.post("/login", authcontroller.loginuser)
router.post("/logout", authcontroller.logoutuser)

module.exports = router