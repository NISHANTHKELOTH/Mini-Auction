const express = require("express");

const {
    addPlayer,
    getPlayers
} = require("../controllers/playerController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, addPlayer);

router.get("/", protect, getPlayers);

module.exports = router;