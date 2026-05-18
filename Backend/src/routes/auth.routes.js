const express = require("express");
const router = express.Router();

const authcontroller = require("../controllers/auth.controller");
const authmiddlewares = require("../middlewares/auth.middleware");

router.post("/register", authcontroller.registeruser);

router.post("/login", authcontroller.loginuser);

router.post("/logout", authcontroller.logoutuser);

router.get("/me", authmiddlewares, authcontroller.me);

router.get("/profile", authmiddlewares, authcontroller.getProfile);

module.exports = router;