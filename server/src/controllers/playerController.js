const Player = require("../models/Player");

const addPlayer = async (req, res) => {
    try {
        const { name, category, basePrice } = req.body;

        if (!name || !category || basePrice === undefined) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        const player = await Player.create({
            name,
            category,
            basePrice: Number(basePrice) * 100000
        });

        res.status(201).json({
            message: "Player added successfully",
            player
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getPlayers = async (req, res) => {
    try {
        const players = await Player.find();

        res.status(200).json({
            players
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    addPlayer,
    getPlayers
};