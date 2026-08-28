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
    getAuctionDetails
);

router.post(
    "/next-player",
    protect,
    createNextPlayer
);

router.post(
    "/current-player",
    protect,
    setCurrentPlayer
);

router.post(
    "/unsold",
    protect,
    markPlayerUnsold
);

router.post(
    "/finish",
    protect,
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