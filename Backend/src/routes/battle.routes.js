const express = require("express");
const {
    getTodayBattles,
    voteBattle,
} = require("../controllers/battle.controller");

const authmiddlewares = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/today", authmiddlewares, getTodayBattles);
router.post("/vote/:battleId", authmiddlewares, voteBattle);

module.exports = router;