const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            enum: [
                "Batsman",
                "Bowler",
                "All-Rounder",
                "Fielder"
            ]
        },

        basePrice: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: [
                "Available",
                "Sold",
                "Unsold"
            ],
            default: "Available"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Player", playerSchema);