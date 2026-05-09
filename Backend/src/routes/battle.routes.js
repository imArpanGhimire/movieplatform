const express = require("express");

const {
    getTodayBattles,
    voteBattle,
    getBattleHistory,
} = require("../controllers/battle.controller");

const authmiddlewares = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/today", authmiddlewares, getTodayBattles);
router.post("/vote/:battleId", authmiddlewares, voteBattle);
router.get("/history", authmiddlewares, getBattleHistory);

module.exports = router;