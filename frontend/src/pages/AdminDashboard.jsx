import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import jsPDF from "jspdf";
import "./AdminDashboard.css";

function AdminDashboard() {
    const navigate = useNavigate();

    const [auctionId, setAuctionId] = useState(
        localStorage.getItem("auctionId") || ""
    );

    const [name, setName] = useState("");
    const [category, setCategory] = useState("Batsman");
    const [basePrice, setBasePrice] = useState("");

    const [auction, setAuction] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState(null);

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const token = localStorage.getItem("token");

    const loadAuction = async () => {
        if (!auctionId.trim() || !token) {
            return;
        }

        try {
            setMessage("");

            const response = await api.get(
                `/auction/details/${auctionId.trim()}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            const loadedAuction =
                response.data.auction;

            setAuction(loadedAuction);
            setCurrentPlayer(
                loadedAuction.currentPlayer
            );

        } catch (error) {
            console.log(error);

            setAuction(null);
            setCurrentPlayer(null);

            setMessage(
                error.response?.data?.message ||
                "Could not load auction"
            );
        }
    };

    const handleAuctionId = (e) => {
        const value = e.target.value;

        setAuctionId(value);

        localStorage.setItem(
            "auctionId",
            value.trim()
        );
    };

    const addNextPlayer = async (e) => {
        e.preventDefault();

        if (!auctionId.trim()) {
            setMessage("Please enter auction ID");
            return;
        }

        if (!name.trim()) {
            setMessage("Please enter player name");
            return;
        }

        if (!basePrice || Number(basePrice) <= 0) {
            setMessage("Enter a valid base price");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const response = await api.post(
                "/auction/next-player",
                {
                    auctionId:
                        auctionId.trim(),
                    name:
                        name.trim(),
                    category,
                    basePrice:
                        Number(basePrice)
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setName("");
            setBasePrice("");

            setCurrentPlayer(
                response.data.player
            );

            setMessage(
                "✅ Next player added successfully"
            );

            await loadAuction();

        } catch (error) {
            console.log(error);

            setMessage(
                error.response?.data?.message ||
                "Failed to add player"
            );

        } finally {
            setLoading(false);
        }
    };

    const markUnsold = async () => {
        if (!auctionId.trim()) {
            setMessage("Please enter auction ID");
            return;
        }

        if (!currentPlayer) {
            setMessage("There is no current player");
            return;
        }

        if (
            currentPlayer.status ===
            "Sold"
        ) {
            setMessage(
                "This player is already sold"
            );
            return;
        }

        const confirmUnsold =
            window.confirm(
                `Mark ${currentPlayer.name} as UNSOLD?`
            );

        if (!confirmUnsold) {
            return;
        }

        try {
            setActionLoading(true);
            setMessage("");

            const response = await api.post(
                "/auction/unsold",
                {
                    auctionId:
                        auctionId.trim()
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setCurrentPlayer(
                response.data.player
            );

            setMessage(
                "🟡 Player marked as UNSOLD"
            );

            await loadAuction();

        } catch (error) {
            console.log(error);

            setMessage(
                error.response?.data?.message ||
                "Failed to mark player unsold"
            );

        } finally {
            setActionLoading(false);
        }
    };

    const finishAuction = async () => {
        if (!auctionId.trim()) {
            setMessage("Please enter auction ID");
            return;
        }

        const confirmFinish =
            window.confirm(
                "Are you sure you want to FINISH this auction?"
            );

        if (!confirmFinish) {
            return;
        }

        try {
            setActionLoading(true);
            setMessage("");

            const response = await api.post(
                "/auction/finish",
                {
                    auctionId:
                        auctionId.trim()
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setAuction(
                response.data.auction
            );

            setCurrentPlayer(
                response.data.auction.currentPlayer
            );

            setMessage(
                "🏁 Auction finished successfully"
            );

        } catch (error) {
            console.log(error);

            setMessage(
                error.response?.data?.message ||
                "Failed to finish auction"
            );

        } finally {
            setActionLoading(false);
        }
    };

    const generatePDF = () => {
        if (!auction) {
            setMessage(
                "Please load an auction first"
            );
            return;
        }

        const doc = new jsPDF();

        let y = 20;

        doc.setFontSize(22);

        doc.text(
            "MINI AUCTION",
            105,
            y,
            {
                align: "center"
            }
        );

        y += 12;

        doc.setFontSize(16);

        doc.text(
            auction.name || "Auction",
            105,
            y,
            {
                align: "center"
            }
        );

        y += 12;

        doc.setFontSize(11);

        doc.text(
            `Auction ID: ${auction.auctionId || auctionId}`,
            20,
            y
        );

        y += 7;

        doc.text(
            `Status: ${auction.auctionStatus || "Unknown"}`,
            20,
            y
        );

        y += 7;

        if (auction.finishedAt) {
            doc.text(
                `Finished: ${new Date(
                    auction.finishedAt
                ).toLocaleString()}`,
                20,
                y
            );

            y += 7;
        }

        doc.text(
            `Maximum Purse: Rs. ${(auction.maxPurse / 10000000).toFixed(2)} Cr`,
            20,
            y
        );

        y += 12;

        doc.line(
            20,
            y,
            190,
            y
        );

        y += 10;

        doc.setFontSize(16);

        doc.text(
            "TEAM DETAILS",
            20,
            y
        );

        y += 10;

        const teams =
            auction.teams || [];

        if (teams.length === 0) {
            doc.setFontSize(11);

            doc.text(
                "No teams have joined this auction.",
                20,
                y
            );

            y += 10;

        } else {
            teams.forEach(
                (team, teamIndex) => {

                    if (y > 255) {
                        doc.addPage();
                        y = 20;
                    }

                    doc.setFontSize(14);

                    doc.text(
                        `${teamIndex + 1}. ${team.teamName}`,
                        20,
                        y
                    );

                    y += 7;

                    doc.setFontSize(11);

                    doc.text(
                        `Remaining Purse: Rs. ${(team.purse / 10000000).toFixed(2)} Cr`,
                        25,
                        y
                    );

                    y += 7;

                    doc.text(
                        `Players Bought: ${team.players?.length || 0}`,
                        25,
                        y
                    );

                    y += 8;

                    if (
                        !team.players ||
                        team.players.length === 0
                    ) {
                        doc.text(
                            "No players bought.",
                            30,
                            y
                        );

                        y += 10;

                    } else {
                        team.players.forEach(
                            (
                                player,
                                playerIndex
                            ) => {

                                if (y > 255) {
                                    doc.addPage();
                                    y = 20;
                                }

                                doc.setFontSize(11);

                                doc.text(
                                    `${playerIndex + 1}. ${player.name}`,
                                    30,
                                    y
                                );

                                y += 6;

                                doc.setFontSize(10);

                                doc.text(
                                    `Category: ${player.category || "N/A"}`,
                                    35,
                                    y
                                );

                                y += 6;

                                doc.text(
                                    `Cost: Rs. ${(player.cost / 100000).toFixed(2)} Lakhs`,
                                    35,
                                    y
                                );

                                y += 9;
                            }
                        );
                    }

                    doc.line(
                        25,
                        y,
                        185,
                        y
                    );

                    y += 10;
                }
            );
        }

        if (y > 260) {
            doc.addPage();
            y = 20;
        }

        y += 5;

        doc.setFontSize(10);

        doc.text(
            "Generated by Mini Auction",
            105,
            y,
            {
                align: "center"
            }
        );

        const fileName =
            `${auction.name || "Auction"}-${auction.auctionId || auctionId}.pdf`
                .replace(
                    /[^a-z0-9-_]/gi,
                    "_"
                );

        doc.save(fileName);

        setMessage(
            "📄 Auction PDF downloaded successfully"
        );
    };

    useEffect(() => {
        if (!auctionId || !token) {
            return;
        }

        loadAuction();

        const interval =
            setInterval(() => {
                loadAuction();
            }, 5000);

        return () =>
            clearInterval(interval);

    }, [auctionId]);

    return (
        <div className="admin-page">

            <div className="admin-container">

                <div className="admin-header">

                    <div className="admin-logo">
                        👑
                    </div>

                    <h1>
                        Mini Auction
                    </h1>

                    <h2>
                        Auction Admin Dashboard
                    </h2>

                    <p>
                        You are the admin of the selected auction.
                    </p>

                </div>

                <div className="auction-id-section">

                    <div className="section-heading">

                        <span>
                            🔑
                        </span>

                        <div>
                            <h2>
                                Auction ID
                            </h2>

                            <p>
                                Load an auction you created
                            </p>
                        </div>

                    </div>

                    <input
                        type="text"
                        placeholder="Enter Auction ID"
                        value={auctionId}
                        onChange={
                            handleAuctionId
                        }
                    />

                    <p className="current-auction">

                        Current Auction:{" "}

                        <strong>
                            {auctionId ||
                                "Not selected"}
                        </strong>

                    </p>

                </div>

                {auction && (

                    <div className="auction-info">

                        <div className="section-heading">

                            <span>
                                📊
                            </span>

                            <div>
                                <h2>
                                    Auction Information
                                </h2>

                                <p>
                                    Current auction overview
                                </p>
                            </div>

                        </div>

                        <div className="auction-info-grid">

                            <div className="info-card">

                                <span>
                                    AUCTION NAME
                                </span>

                                <strong>
                                    {auction.name}
                                </strong>

                            </div>

                            <div className="info-card">

                                <span>
                                    TEAMS
                                </span>

                                <strong>
                                    {auction.teams?.length || 0}
                                    {" / "}
                                    {auction.teamsCount}
                                </strong>

                            </div>

                            <div className="info-card">

                                <span>
                                    MAXIMUM PURSE
                                </span>

                                <strong>
                                    ₹
                                    {(
                                        auction.maxPurse /
                                        10000000
                                    ).toFixed(2)}
                                    Cr
                                </strong>

                            </div>

                            <div className="info-card">

                                <span>
                                    STATUS
                                </span>

                                <strong>
                                    {auction.auctionStatus}
                                </strong>

                            </div>

                        </div>

                    </div>
                )}

                <div className="player-form">

                    <div className="section-heading">

                        <span>
                            ➕
                        </span>

                        <div>

                            <h2>
                                Add Next Player
                            </h2>

                            <p>
                                Put the next player up for auction
                            </p>

                        </div>

                    </div>

                    <form
                        onSubmit={
                            addNextPlayer
                        }
                    >

                        <div className="form-group">

                            <label>
                                Player Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter player name"
                                value={name}
                                onChange={(e) =>
                                    setName(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Category
                            </label>

                            <select
                                value={category}
                                onChange={(e) =>
                                    setCategory(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="Batsman">
                                    Batsman
                                </option>

                                <option value="Bowler">
                                    Bowler
                                </option>

                                <option value="All-Rounder">
                                    All-Rounder
                                </option>

                                <option value="Fielder">
                                    Fielder
                                </option>

                            </select>

                        </div>

                        <div className="form-group">

                            <label>
                                Base Price (Lakhs)
                            </label>

                            <input
                                type="number"
                                min="1"
                                step="0.01"
                                placeholder="Example: 50"
                                value={basePrice}
                                onChange={(e) =>
                                    setBasePrice(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <button
                            className="add-player-button"
                            type="submit"
                            disabled={
                                loading ||
                                !auction ||
                                auction.auctionStatus === "Finished"
                            }
                        >
                            {loading
                                ? "ADDING..."
                                : "▶ ADD NEXT PLAYER"}
                        </button>

                    </form>

                </div>

                <div className="current-player">

                    <div className="section-heading center-heading">

                        <span>
                            🔥
                        </span>

                        <div>

                            <h2>
                                Current Player
                            </h2>

                            <p>
                                Player currently on the auction block
                            </p>

                        </div>

                    </div>

                    {currentPlayer ? (

                        <>

                            <div className="player-name">

                                🏏{" "}
                                {currentPlayer.name}

                            </div>

                            <div className="admin-player-info">

                                <div>

                                    <span>
                                        CATEGORY
                                    </span>

                                    <strong>
                                        {
                                            currentPlayer.category
                                        }
                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        BASE PRICE
                                    </span>

                                    <strong>

                                        ₹
                                        {(
                                            currentPlayer.basePrice /
                                            100000
                                        ).toFixed(2)}
                                        Lakhs

                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        STATUS
                                    </span>

                                    <strong className="player-status">
                                        {
                                            currentPlayer.status
                                        }
                                    </strong>

                                </div>

                            </div>

                            {currentPlayer.status ===
                                "Available" && (

                                <button
                                    className="unsold-button"
                                    onClick={
                                        markUnsold
                                    }
                                    disabled={
                                        actionLoading
                                    }
                                >
                                    ❌ MARK UNSOLD
                                </button>

                            )}

                        </>

                    ) : (

                        <div className="no-current-player">

                            <span>
                                ⏳
                            </span>

                            <p>
                                No player selected yet.
                            </p>

                            <small>
                                Add a player above to start the auction.
                            </small>

                        </div>

                    )}

                </div>

                <div className="auction-control">

                    <div className="section-heading center-heading">

                        <span>
                            🏁
                        </span>

                        <div>

                            <h2>
                                Auction Control
                            </h2>

                            <p>
                                Manage the auction status
                            </p>

                        </div>

                    </div>

                    {auction?.auctionStatus !==
                        "Finished" ? (

                        <button
                            className="finish-button"
                            onClick={
                                finishAuction
                            }
                            disabled={
                                actionLoading ||
                                !auction
                            }
                        >
                            🏁 FINISH AUCTION
                        </button>

                    ) : (

                        <div className="finished-message">
                            ✅ This auction is finished.
                        </div>

                    )}

                    {auction && (

                        <button
                            className="pdf-button"
                            onClick={
                                generatePDF
                            }
                        >
                            📄 DOWNLOAD AUCTION PDF
                        </button>

                    )}

                </div>

                <div className="teams-section">

                    <div className="section-heading">

                        <span>
                            👥
                        </span>

                        <div>

                            <h2>
                                Teams
                            </h2>

                            <p>
                                Teams participating in this auction
                            </p>

                        </div>

                    </div>

                    {!auction ? (

                        <div className="empty-section">

                            <span>
                                🔑
                            </span>

                            <p>
                                Enter an Auction ID to load teams.
                            </p>

                        </div>

                    ) : auction.teams.length ===
                        0 ? (

                        <div className="empty-section">

                            <span>
                                👥
                            </span>

                            <p>
                                No captains have joined yet.
                            </p>

                        </div>

                    ) : (

                        <div className="teams-grid">

                            {auction.teams.map(
                                (team, ind) => (

                                    <div
                                        className="team-card"
                                        key={
                                            team._id ||
                                            ind
                                        }
                                    >

                                        <div className="team-card-header">

                                            <div>

                                                <span className="team-number">
                                                    TEAM {ind + 1}
                                                </span>

                                                <h3>
                                                    🏏{" "}
                                                    {team.teamName}
                                                </h3>

                                            </div>

                                        </div>

                                        <div className="team-stats">

                                            <div>

                                                <span>
                                                    REMAINING PURSE
                                                </span>

                                                <strong>
                                                    ₹
                                                    {(
                                                        team.purse /
                                                        10000000
                                                    ).toFixed(2)}
                                                    Cr
                                                </strong>

                                            </div>

                                            <div>

                                                <span>
                                                    PLAYERS
                                                </span>

                                                <strong>
                                                    {
                                                        team.players?.length ||
                                                        0
                                                    }
                                                </strong>

                                            </div>

                                        </div>

                                        {team.players?.length ===
                                            0 ? (

                                            <div className="no-team-players">
                                                No players bought yet.
                                            </div>

                                        ) : (

                                            <div className="team-players">

                                                {team.players.map(
                                                    (
                                                        player,
                                                        playerIndex
                                                    ) => (

                                                        <div
                                                            className="team-player"
                                                            key={
                                                                player._id ||
                                                                playerIndex
                                                            }
                                                        >

                                                            <div>

                                                                <strong>
                                                                    🏏{" "}
                                                                    {
                                                                        player.name
                                                                    }
                                                                </strong>

                                                                <span>
                                                                    {
                                                                        player.category
                                                                    }
                                                                </span>

                                                            </div>

                                                            <strong className="team-player-cost">

                                                                ₹
                                                                {(
                                                                    player.cost /
                                                                    100000
                                                                ).toFixed(2)}
                                                                L

                                                            </strong>

                                                        </div>

                                                    )
                                                )}

                                            </div>

                                        )}

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

                {message && (

                    <div className="message">
                        {message}
                    </div>

                )}

                <p className="auto-update">
                    🔄 Dashboard updates automatically
                    every 5 seconds
                </p>

                <button
                    className="back-button"
                    onClick={() =>
                        navigate("/welcome")
                    }
                >
                    ← Back to Welcome
                </button>

            </div>

        </div>
    );
}

export default AdminDashboard;