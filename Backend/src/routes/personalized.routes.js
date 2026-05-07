const express = require("express");
const {
    getPersonalizedHome,
} = require("../controllers/personalized.controller");

const authmiddlewares = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/home", authmiddlewares, getPersonalizedHome);

module.exports = router;