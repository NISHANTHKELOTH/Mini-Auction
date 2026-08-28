const Auction = require("../models/Auction");
const Player = require("../models/Player");

const createAuction = async (req, res) => {
    try {
        const {
            name,
            maxPurse,
            teamsCount
        } = req.body;

        if (!name || !maxPurse || !teamsCount) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        const auctionId =
            "MA-" +
            Math.random()
                .toString(36)
                .substring(2, 8)
                .toUpperCase();

        const auction = await Auction.create({
            auctionId,
            name,
            maxPurse,
            teamsCount,
            admin: req.userId,
            teams: []
        });

        res.status(201).json({
            message: "Auction created successfully",
            auction
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const joinAuction = async (req, res) => {
    try {
        const {
            auctionId,
            teamName
        } = req.body;

        if (!auctionId || !teamName) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        const auction =
            await Auction.findOne({
                auctionId
            });

        if (!auction) {
            return res.status(404).json({
                message: "Auction not found"
            });
        }

        if (
            auction.auctionStatus ===
            "Finished"
        ) {
            return res.status(400).json({
                message:
                    "This auction is already finished"
            });
        }

        const alreadyJoined =
            auction.teams.find(
                (team) =>
                    team.captain?.toString() ===
                    req.userId
            );

        if (alreadyJoined) {
            return res.status(400).json({
                message:
                    "You already joined this auction"
            });
        }

        if (
            auction.teams.length >=
            auction.teamsCount
        ) {
            return res.status(400).json({
                message:
                    "All teams are already filled"
            });
        }

        auction.teams.push({
            captain: req.userId,
            teamName,
            purse: auction.maxPurse,
            players: []
        });

        await auction.save();

        res.status(200).json({
            message:
                "Auction joined successfully",
            auction
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const addPlayer = async (req, res) => {
    try {
        const {
            auctionId,
            cost
        } = req.body;

        if (
            !auctionId ||
            cost === undefined
        ) {
            return res.status(400).json({
                message:
                    "Auction ID and purchase price are required"
            });
        }

        const auction =
            await Auction.findOne({
                auctionId
            });

        if (!auction) {
            return res.status(404).json({
                message:
                    "Auction not found"
            });
        }

        if (
            auction.auctionStatus ===
            "Finished"
        ) {
            return res.status(400).json({
                message:
                    "Auction is already finished"
            });
        }

        if (!auction.currentPlayer) {
            return res.status(400).json({
                message:
                    "No current player"
            });
        }

        const team =
            auction.teams.find(
                (team) =>
                    team.captain?.toString() ===
                    req.userId
            );

        if (!team) {
            return res.status(404).json({
                message:
                    "Team not found"
            });
        }

        const player =
            await Player.findById(
                auction.currentPlayer
            );

        if (!player) {
            return res.status(404).json({
                message:
                    "Player not found"
            });
        }

        if (player.status === "Sold") {
            return res.status(400).json({
                message:
                    "Player already sold"
            });
        }

        if (player.status === "Unsold") {
            return res.status(400).json({
                message:
                    "Player is already unsold"
            });
        }

        const playerCost =
            Number(cost) * 100000;

        if (
            playerCost <
            player.basePrice
        ) {
            return res.status(400).json({
                message:
                    "Purchase price cannot be below base price"
            });
        }

        if (
            playerCost >
            team.purse
        ) {
            return res.status(400).json({
                message:
                    "Not enough purse"
            });
        }

        team.players.push({
            playerId: player._id,
            name: player.name,
            cost: playerCost,
            category: player.category
        });

        team.purse -= playerCost;

        player.status = "Sold";

        await player.save();
        await auction.save();

        res.status(200).json({
            message:
                "Player added successfully",
            team
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getMyTeam = async (req, res) => {
    try {
        const {
            auctionId
        } = req.params;

        const auction =
            await Auction.findOne({
                auctionId
            });

        if (!auction) {
            return res.status(404).json({
                message:
                    "Auction not found"
            });
        }

        const team =
            auction.teams.find(
                (team) =>
                    team.captain?.toString() ===
                    req.userId
            );

        if (!team) {
            return res.status(404).json({
                message:
                    "You have not joined this auction"
            });
        }

        res.status(200).json({
            team
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getAuctionDetails = async (
    req,
    res
) => {
    try {
        const {
            auctionId
        } = req.params;

        const auction =
            await Auction.findOne({
                auctionId
            }).populate(
                "currentPlayer"
            );

        if (!auction) {
            return res.status(404).json({
                message:
                    "Auction not found"
            });
        }

        if (
            auction.admin.toString() !==
            req.userId
        ) {
            return res.status(403).json({
                message:
                    "Only admin can view auction details"
            });
        }

        res.status(200).json({
            auction
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getCurrentPlayer = async (
    req,
    res
) => {
    try {
        const {
            auctionId
        } = req.params;

        const auction =
            await Auction.findOne({
                auctionId
            }).populate(
                "currentPlayer"
            );

        if (!auction) {
            return res.status(404).json({
                message:
                    "Auction not found"
            });
        }

        res.status(200).json({
            currentPlayer:
                auction.currentPlayer
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const setCurrentPlayer = async (
    req,
    res
) => {
    try {
        const {
            auctionId,
            playerId
        } = req.body;

        if (
            !auctionId ||
            !playerId
        ) {
            return res.status(400).json({
                message:
                    "Auction ID and Player ID are required"
            });
        }

        const auction =
            await Auction.findOne({
                auctionId
            });

        if (!auction) {
            return res.status(404).json({
                message:
                    "Auction not found"
            });
        }

        if (
            auction.admin.toString() !==
            req.userId
        ) {
            return res.status(403).json({
                message:
                    "Only admin can select players"
            });
        }

        if (
            auction.auctionStatus ===
            "Finished"
        ) {
            return res.status(400).json({
                message:
                    "Auction is already finished"
            });
        }

        const player =
            await Player.findById(
                playerId
            );

        if (!player) {
            return res.status(404).json({
                message:
                    "Player not found"
            });
        }

        if (
            player.status === "Sold"
        ) {
            return res.status(400).json({
                message:
                    "Player is already sold"
            });
        }

        auction.currentPlayer =
            player._id;

        auction.auctionStatus =
            "Live";

        await auction.save();

        res.status(200).json({
            message:
                "Current player updated",
            auction
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const createNextPlayer = async (
    req,
    res
) => {
    try {
        const {
            auctionId,
            name,
            category,
            basePrice
        } = req.body;

        if (
            !auctionId ||
            !name ||
            !category ||
            basePrice === undefined
        ) {
            return res.status(400).json({
                message:
                    "Please fill all fields"
            });
        }

        const auction =
            await Auction.findOne({
                auctionId
            });

        if (!auction) {
            return res.status(404).json({
                message:
                    "Auction not found"
            });
        }

        if (
            auction.admin.toString() !==
            req.userId
        ) {
            return res.status(403).json({
                message:
                    "Only admin can add players"
            });
        }

        if (
            auction.auctionStatus ===
            "Finished"
        ) {
            return res.status(400).json({
                message:
                    "Auction is already finished"
            });
        }

        if (auction.currentPlayer) {
            const previousPlayer =
                await Player.findById(
                    auction.currentPlayer
                );

            if (
                previousPlayer &&
                previousPlayer.status ===
                    "Available"
            ) {
                previousPlayer.status =
                    "Unsold";

                await previousPlayer.save();
            }
        }

        const player =
            await Player.create({
                name,
                category,
                basePrice:
                    Number(basePrice) *
                    100000,
                status: "Available"
            });

        auction.currentPlayer =
            player._id;

        auction.auctionStatus =
            "Live";

        await auction.save();

        res.status(201).json({
            message:
                "Next player added successfully",
            player
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const markPlayerUnsold = async (
    req,
    res
) => {
    try {
        const {
            auctionId
        } = req.body;

        if (!auctionId) {
            return res.status(400).json({
                message:
                    "Auction ID is required"
            });
        }

        const auction =
            await Auction.findOne({
                auctionId
            });

        if (!auction) {
            return res.status(404).json({
                message:
                    "Auction not found"
            });
        }

        if (
            auction.admin.toString() !==
            req.userId
        ) {
            return res.status(403).json({
                message:
                    "Only admin can mark player unsold"
            });
        }

        if (
            auction.auctionStatus ===
            "Finished"
        ) {
            return res.status(400).json({
                message:
                    "Auction is already finished"
            });
        }

        if (!auction.currentPlayer) {
            return res.status(400).json({
                message:
                    "No current player"
            });
        }

        const player =
            await Player.findById(
                auction.currentPlayer
            );

        if (!player) {
            return res.status(404).json({
                message:
                    "Current player not found"
            });
        }

        if (
            player.status === "Sold"
        ) {
            return res.status(400).json({
                message:
                    "Player is already sold"
            });
        }

        player.status =
            "Unsold";

        await player.save();

        res.status(200).json({
            message:
                "Player marked as unsold",
            player
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const finishAuction = async (
    req,
    res
) => {
    try {
        const {
            auctionId
        } = req.body;

        if (!auctionId) {
            return res.status(400).json({
                message:
                    "Auction ID is required"
            });
        }

        const auction =
            await Auction.findOne({
                auctionId
            });

        if (!auction) {
            return res.status(404).json({
                message:
                    "Auction not found"
            });
        }

        if (
            auction.admin.toString() !==
            req.userId
        ) {
            return res.status(403).json({
                message:
                    "Only admin can finish auction"
            });
        }

        if (
            auction.auctionStatus ===
            "Finished"
        ) {
            return res.status(400).json({
                message:
                    "Auction is already finished"
            });
        }

        auction.auctionStatus =
            "Finished";

        auction.finishedAt =
            new Date();

        await auction.save();

        res.status(200).json({
            message:
                "Auction finished successfully",
            auction
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const removePlayer = async (
    req,
    res
) => {
    try {
        const {
            auctionId,
            playerId,
            teamPlayerId,
            playerName
        } = req.body;

        if (!auctionId) {
            return res.status(400).json({
                message:
                    "Auction ID is required"
            });
        }

        const auction =
            await Auction.findOne({
                auctionId
            });

        if (!auction) {
            return res.status(404).json({
                message:
                    "Auction not found"
            });
        }

        if (
            auction.auctionStatus ===
            "Finished"
        ) {
            return res.status(400).json({
                message:
                    "Auction is already finished"
            });
        }

        const team =
            auction.teams.find(
                (team) =>
                    team.captain?.toString() ===
                    req.userId
            );

        if (!team) {
            return res.status(404).json({
                message:
                    "Team not found"
            });
        }

        let playerIndex = -1;

        if (playerId) {
            playerIndex =
                team.players.findIndex(
                    (player) =>
                        player.playerId &&
                        player.playerId
                            .toString() ===
                            playerId.toString()
                );
        }

        if (
            playerIndex === -1 &&
            teamPlayerId
        ) {
            playerIndex =
                team.players.findIndex(
                    (player) =>
                        player._id &&
                        player._id.toString() ===
                            teamPlayerId.toString()
                );
        }

        if (
            playerIndex === -1 &&
            playerName
        ) {
            playerIndex =
                team.players.findIndex(
                    (player) =>
                        player.name ===
                        playerName
                );
        }

        if (playerIndex === -1) {
            return res.status(404).json({
                message:
                    "Player not found in your team"
            });
        }

        const teamPlayer =
            team.players[playerIndex];

        team.purse += Number(
            teamPlayer.cost || 0
        );

        if (teamPlayer.playerId) {
            const player =
                await Player.findById(
                    teamPlayer.playerId
                );

            if (player) {
                player.status =
                    "Available";

                await player.save();
            }
        }

        team.players.splice(
            playerIndex,
            1
        );

        await auction.save();

        res.status(200).json({
            message:
                "Player removed and purse refunded successfully",
            team
        });

    } catch (error) {
        console.error(
            "REMOVE PLAYER ERROR:",
            error
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getAuctionHistory = async (
    req,
    res
) => {
    try {
        const auctions =
            await Auction.find({})
                .sort({
                    createdAt: -1
                });

        res.status(200).json({
            auctions
        });

    } catch (error) {
        console.error(
            "AUCTION HISTORY ERROR:",
            error
        );

        res.status(500).json({
            message:
                "Failed to load auction history"
        });
    }
};

module.exports = {
    createAuction,
    joinAuction,
    addPlayer,
    getMyTeam,
    getAuctionDetails,
    getCurrentPlayer,
    setCurrentPlayer,
    createNextPlayer,
    markPlayerUnsold,
    finishAuction,
    removePlayer,
    getAuctionHistory
};