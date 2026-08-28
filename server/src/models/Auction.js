const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema(
    {
        auctionId: {
            type: String,
            required: true,
            unique: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        maxPurse: {
            type: Number,
            required: true
        },

        teamsCount: {
            type: Number,
            required: true
        },

        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        currentPlayer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Player",
            default: null
        },

        auctionStatus: {
            type: String,
            enum: ["Waiting", "Live", "Finished"],
            default: "Waiting"
        },

        finishedAt: {
            type: Date,
            default: null
        },

        teams: [
            {
                captain: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },

                teamName: {
                    type: String,
                    trim: true
                },

                purse: {
                    type: Number
                },

                players: [
                    {
                        playerId: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref: "Player"
                        },

                        name: {
                            type: String
                        },

                        cost: {
                            type: Number
                        },

                        category: {
                            type: String,
                            enum: [
                                "Batsman",
                                "Bowler",
                                "All-Rounder",
                                "Fielder"
                            ]
                        }
                    }
                ]
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Auction",
    auctionSchema
);