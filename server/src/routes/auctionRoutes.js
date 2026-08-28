const express = require("express");

const {
    createAuction,
    joinAuction,
    addPlayer,
    getMyTeam,
    getCurrentPlayer,
    getAuctionDetails,
    setCurrentPlayer,
    createNextPlayer,
    markPlayerUnsold,
    finishAuction,
    removePlayer,
    getAuctionHistory
} = require("../controllers/auctionController");

const protect =
    require("../middleware/authMiddleware");

const adminOnly =
    require("../middleware/adminMiddleware");

const router = express.Router();

router.post(
    "/create",
    protect,
    createAuction
);

router.post(
    "/join",
    protect,
    joinAuction
);

router.post(
    "/add-player",
    protect,
    addPlayer
);

router.get(
    "/current/:auctionId",
    protect,
    getCurrentPlayer
);

router.get(
    "/history",
    protect,
    getAuctionHistory
);

router.get(
    "/details/:auctionId",
    protect,
    adminOnly,
    getAuctionDetails
);

router.post(
    "/next-player",
    protect,
    adminOnly,
    createNextPlayer
);

router.post(
    "/current-player",
    protect,
    adminOnly,
    setCurrentPlayer
);

router.post(
    "/unsold",
    protect,
    adminOnly,
    markPlayerUnsold
);

router.post(
    "/finish",
    protect,
    adminOnly,
    finishAuction
);

router.post(
    "/remove-player",
    protect,
    removePlayer
);

router.get(
    "/:auctionId",
    protect,
    getMyTeam
);

module.exports = router;