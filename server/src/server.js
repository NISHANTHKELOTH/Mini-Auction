const express = require("express");
const cors = require("cors");
require("dotenv").config();
const auctionRoutes = require("./routes/auctionRoutes");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const playerRoutes = require("./routes/playerRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auction", auctionRoutes);
app.use("/api/players", playerRoutes);


app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Mini Auction Server is Running 🚀");
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

connectDB();