import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import jsPDF from "jspdf";
import "./CaptainDashboard.css";

function CaptainDashboard() {
    const navigate = useNavigate();

    const [auctionId, setAuctionId] = useState(
        localStorage.getItem("auctionId") || ""
    );

    const [team, setTeam] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [cost, setCost] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    const loadAuction = async () => {
        const savedAuctionId =
            localStorage.getItem("auctionId");

        const id =
            auctionId.trim() || savedAuctionId;

        if (!id || !token) {
            return;
        }

        try {
            const teamResponse = await api.get(
                `/auction/${id}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setTeam(
                teamResponse.data.team
            );

            const playerResponse = await api.get(
                `/auction/current/${id}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setCurrentPlayer(
                playerResponse.data.currentPlayer
            );

        } catch (error) {
            console.log(
                "LOAD AUCTION ERROR:",
                error.response?.data ||
                error.message
            );

            setMessage(
                error.response?.data?.message ||
                "Could not load auction"
            );
        }
    };

    const handleLoadAuction = async () => {
        const cleanAuctionId =
            auctionId.trim();

        if (!cleanAuctionId) {
            setMessage(
                "Please enter auction ID"
            );
            return;
        }

        setAuctionId(
            cleanAuctionId
        );

        localStorage.setItem(
            "auctionId",
            cleanAuctionId
        );

        setMessage("");

        await loadAuction();
    };

    const handleAddPlayer = async (e) => {
        e.preventDefault();

        if (!currentPlayer) {
            setMessage(
                "No current player"
            );
            return;
        }

        if (!cost || Number(cost) <= 0) {
            setMessage(
                "Enter a valid purchase price"
            );
            return;
        }

        const purchasePrice =
            Number(cost);

        const minimumPrice =
            currentPlayer.basePrice /
            100000;

        if (
            purchasePrice <
            minimumPrice
        ) {
            setMessage(
                `Minimum price is ${minimumPrice} Lakhs`
            );
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const response = await api.post(
                "/auction/add-player",
                {
                    auctionId:
                        auctionId.trim(),
                    cost: purchasePrice
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setTeam(
                response.data.team
            );

            setCost("");

            setMessage(
                "✅ Player added to your team successfully"
            );

            await loadAuction();

        } catch (error) {
            console.log(
                "ADD PLAYER ERROR:",
                error.response?.data ||
                error.message
            );

            setMessage(
                error.response?.data?.message ||
                "Failed to add player"
            );

        } finally {
            setLoading(false);
        }
    };

    const handleRemovePlayer = async (
        player
    ) => {
        if (!player) {
            setMessage(
                "Player information is missing"
            );
            return;
        }

        const playerId =
            player.playerId || null;

        const teamPlayerId =
            player._id || null;

        if (
            !playerId &&
            !teamPlayerId
        ) {
            setMessage(
                "Cannot identify this player"
            );
            return;
        }

        const confirmRemove =
            window.confirm(
                `Are you sure you want to remove ${player.name}?`
            );

        if (!confirmRemove) {
            return;
        }

        try {
            setLoading(true);

            setMessage(
                "Removing player..."
            );

            const response =
                await api.post(
                    "/auction/remove-player",
                    {
                        auctionId:
                            auctionId.trim(),

                        playerId,

                        teamPlayerId,

                        playerName:
                            player.name
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            if (response.data.team) {
                setTeam(
                    response.data.team
                );
            }

            setMessage(
                "✅ Player removed and purse refunded successfully"
            );

            setTimeout(() => {
                loadAuction();
            }, 200);

        } catch (error) {
            console.log(
                "REMOVE PLAYER ERROR:",
                error.response?.data ||
                error.message
            );

            setMessage(
                error.response?.data?.message ||
                "Failed to remove player"
            );

        } finally {
            setLoading(false);
        }
    };

    const generateTeamPDF = () => {
        if (!team) {
            setMessage(
                "Team information is not available"
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

        doc.setFontSize(18);

        doc.text(
            team.teamName || "My Team",
            105,
            y,
            {
                align: "center"
            }
        );

        y += 12;

        doc.setFontSize(11);

        doc.text(
            `Auction ID: ${auctionId}`,
            20,
            y
        );

        y += 8;

        doc.text(
            `Remaining Purse: Rs. ${(team.purse / 10000000).toFixed(2)} Cr`,
            20,
            y
        );

        y += 8;

        doc.text(
            `Players Bought: ${team.players?.length || 0}`,
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

        y += 12;

        doc.setFontSize(16);

        doc.text(
            "MY PLAYERS",
            20,
            y
        );

        y += 10;

        const players =
            team.players || [];

        if (
            players.length === 0
        ) {
            doc.setFontSize(11);

            doc.text(
                "No players bought yet.",
                25,
                y
            );

        } else {
            players.forEach(
                (player, ind) => {

                    if (y > 260) {
                        doc.addPage();
                        y = 20;
                    }

                    doc.setFontSize(13);

                    doc.text(
                        `${ind + 1}. ${player.name}`,
                        25,
                        y
                    );

                    y += 7;

                    doc.setFontSize(10);

                    doc.text(
                        `Category: ${player.category || "N/A"}`,
                        32,
                        y
                    );

                    y += 6;

                    doc.text(
                        `Purchase Price: Rs. ${(player.cost / 100000).toFixed(2)} Lakhs`,
                        32,
                        y
                    );

                    y += 10;

                    doc.line(
                        30,
                        y,
                        180,
                        y
                    );

                    y += 8;
                }
            );
        }

        if (y > 260) {
            doc.addPage();
            y = 20;
        }

        y += 10;

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
            `${team.teamName || "My-Team"}-${auctionId}.pdf`
                .replace(
                    /[^a-z0-9-_]/gi,
                    "_"
                );

        doc.save(fileName);

        setMessage(
            "📄 Team PDF generated successfully"
        );
    };

    useEffect(() => {
        const savedAuctionId =
            localStorage.getItem("auctionId");

        if (
            !savedAuctionId ||
            !token
        ) {
            return;
        }

        setAuctionId(
            savedAuctionId
        );

        loadAuction();

        const interval =
            setInterval(() => {
                loadAuction();
            }, 5000);

        return () => {
            clearInterval(interval);
        };

    }, []);

    return (
        <div className="captain-page">

            <div className="captain-glow captain-glow-one"></div>
            <div className="captain-glow captain-glow-two"></div>

            <div className="captain-container">

                <div className="captain-header">

                    <div className="captain-logo">
                        👨‍✈️
                    </div>

                    <h1>
                        Mini Auction
                    </h1>

                    <h2>
                        Captain Dashboard
                    </h2>

                    <p>
                        Build your team and manage
                        your auction purse.
                    </p>

                </div>

                {!team && (

                    <div className="team-header join-team-card">

                        <div className="section-icon">
                            🔑
                        </div>

                        <h2>
                            Join Your Auction
                        </h2>

                        <p>
                            Enter the Auction ID provided
                            by the admin.
                        </p>

                        <input
                            className="auction-input"
                            type="text"
                            placeholder="Example: MA-4M1XVI"
                            value={auctionId}
                            onChange={(e) =>
                                setAuctionId(
                                    e.target.value
                                )
                            }
                        />

                        <button
                            className="load-button"
                            onClick={
                                handleLoadAuction
                            }
                        >
                            🚀 LOAD AUCTION
                        </button>

                    </div>
                )}

                {team && (

                    <>

                        <div className="team-header">

                            <div>
                                <span className="team-label">
                                    YOUR TEAM
                                </span>

                                <h2>
                                    🏏 {team.teamName}
                                </h2>
                            </div>

                            <div className="purse-card">
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

                        </div>

                        <div className="current-player">

                            <div className="section-title">
                                <span className="section-icon">
                                    🔥
                                </span>

                                <div>
                                    <h2>
                                        Current Player
                                    </h2>

                                    <p>
                                        Live auction player
                                    </p>
                                </div>
                            </div>

                            {currentPlayer ? (

                                <>

                                    <div className="current-player-name">
                                        🏏{" "}
                                        {currentPlayer.name}
                                    </div>

                                    <div className="player-info-row">

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
                                        "Available" ? (

                                        <form
                                            className="buy-form"
                                            onSubmit={
                                                handleAddPlayer
                                            }
                                        >

                                            <div className="form-group">

                                                <label>
                                                    Purchase Price
                                                    (Lakhs)
                                                </label>

                                                <input
                                                    type="number"
                                                    min={
                                                        currentPlayer.basePrice /
                                                        100000
                                                    }
                                                    step="0.01"
                                                    placeholder="Example: 75"
                                                    value={cost}
                                                    disabled={
                                                        loading
                                                    }
                                                    onChange={(e) =>
                                                        setCost(
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                            </div>

                                            <button
                                                className="buy-button"
                                                type="submit"
                                                disabled={
                                                    loading
                                                }
                                            >
                                                {loading
                                                    ? "PROCESSING..."
                                                    : "💰 ADD TO MY TEAM"}
                                            </button>

                                        </form>

                                    ) : currentPlayer.status ===
                                        "Sold" ? (

                                        <div className="status-message sold">
                                            🔴 This player has
                                            already been sold.
                                        </div>

                                    ) : (

                                        <div className="status-message unsold">
                                            🟡 This player is
                                            unsold.
                                        </div>

                                    )}

                                </>

                            ) : (

                                <div className="waiting-message">
                                    <span>
                                        ⏳
                                    </span>

                                    <p>
                                        Waiting for admin to
                                        add the next player...
                                    </p>
                                </div>

                            )}

                        </div>

                        <div className="my-players">

                            <div className="section-title">

                                <span className="section-icon">
                                    👥
                                </span>

                                <div>
                                    <h2>
                                        My Players
                                    </h2>

                                    <p>
                                        Players bought by your team
                                    </p>
                                </div>

                            </div>

                            {!team.players ||
                            team.players.length === 0 ? (

                                <div className="empty-players">
                                    <span>
                                        🏏
                                    </span>

                                    <p>
                                        No players yet.
                                    </p>

                                    <small>
                                        Your purchased players
                                        will appear here.
                                    </small>
                                </div>

                            ) : (

                                <div className="players-grid">

                                    {team.players.map(
                                        (
                                            player,
                                            ind
                                        ) => (

                                            <div
                                                className="player-card"
                                                key={
                                                    player._id ||
                                                    player.playerId ||
                                                    ind
                                                }
                                            >

                                                <div className="player-card-icon">
                                                    🏏
                                                </div>

                                                <h3>
                                                    {player.name}
                                                </h3>

                                                <div className="player-category">
                                                    {player.category}
                                                </div>

                                                <p className="player-cost">
                                                    ₹
                                                    {(
                                                        player.cost /
                                                        100000
                                                    ).toFixed(2)}
                                                    {" "}
                                                    Lakhs
                                                </p>

                                                <button
                                                    className="remove-button"
                                                    disabled={
                                                        loading
                                                    }
                                                    onClick={() =>
                                                        handleRemovePlayer(
                                                            player
                                                        )
                                                    }
                                                >
                                                    ❌ REMOVE PLAYER
                                                </button>

                                            </div>

                                        )
                                    )}

                                </div>
                            )}

                            <button
                                className="team-pdf-button"
                                onClick={
                                    generateTeamPDF
                                }
                            >
                                📄 DOWNLOAD MY TEAM PDF
                            </button>

                        </div>

                    </>
                )}

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

export default CaptainDashboard;