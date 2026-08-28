import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AuctionView.css";

function AuctionView() {
    const navigate = useNavigate();

    const [auctionId, setAuctionId] = useState(
        localStorage.getItem("auctionId") || ""
    );

    const [auction, setAuction] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    const loadAuction = async () => {
        const id = auctionId.trim();

        if (!id || !token) {
            return;
        }

        try {
            const response = await api.get(
                `/auction/current/${id}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setCurrentPlayer(
                response.data.currentPlayer
            );

            setAuction({
                auctionId: id
            });

            localStorage.setItem(
                "auctionId",
                id
            );

            setMessage("");

        } catch (error) {
            console.log(
                "AUCTION VIEW ERROR:",
                error.response?.data ||
                error.message
            );

            setMessage(
                error.response?.data?.message ||
                "Auction not found"
            );
        }
    };

    const handleWatchAuction = async () => {
        if (!auctionId.trim()) {
            setMessage(
                "Please enter auction ID"
            );
            return;
        }

        setLoading(true);
        setMessage("");

        await loadAuction();

        setLoading(false);
    };

    const changeAuction = () => {
        setAuction(null);
        setCurrentPlayer(null);
        setMessage("");
        setAuctionId("");
    };

    useEffect(() => {
        if (!auction) {
            return;
        }

        const interval =
            setInterval(() => {
                loadAuction();
            }, 3000);

        return () => {
            clearInterval(interval);
        };

    }, [auction, auctionId]);

    return (
        <div className="auction-view-page">

            <div className="auction-view-container">

                <div className="auction-view-header">

                    <div className="viewer-logo">
                        👀
                    </div>

                    <h1>
                        Mini Auction
                    </h1>

                    <h2>
                        Live Auction Viewer
                    </h2>

                    <p>
                        Watch the auction in real time
                    </p>

                </div>

                {!auction && (

                    <div className="auction-watch-card">

                        <div className="watch-icon">
                            🔑
                        </div>

                        <h2>
                            Enter Auction
                        </h2>

                        <p>
                            Enter the Auction ID to
                            watch the live auction.
                        </p>

                        <div className="input-wrapper">

                            <label>
                                AUCTION ID
                            </label>

                            <input
                                type="text"
                                placeholder="Example: MA-4M1XVI"
                                value={auctionId}
                                onChange={(e) =>
                                    setAuctionId(
                                        e.target.value
                                    )
                                }
                                onKeyDown={(e) => {
                                    if (
                                        e.key ===
                                        "Enter"
                                    ) {
                                        handleWatchAuction();
                                    }
                                }}
                            />

                        </div>

                        <button
                            className="watch-button"
                            onClick={
                                handleWatchAuction
                            }
                            disabled={loading}
                        >
                            {loading
                                ? "LOADING..."
                                : "👀 WATCH AUCTION"}
                        </button>

                    </div>
                )}

                {auction && (

                    <>

                        <div className="auction-live-bar">

                            <div className="live-auction-id">

                                <span>
                                    AUCTION ID
                                </span>

                                <strong>
                                    {
                                        auction.auctionId
                                    }
                                </strong>

                            </div>

                            <div className="live-badge">
                                <span>
                                    ●
                                </span>

                                LIVE
                            </div>

                        </div>


                        <div className="live-player-card">

                            <div className="live-title">

                                <span>
                                    🔥
                                </span>

                                <div>
                                    <strong>
                                        CURRENT PLAYER
                                    </strong>

                                    <small>
                                        Now on the auction block
                                    </small>
                                </div>

                            </div>


                            {currentPlayer ? (

                                <>

                                    <div className="live-player-main">

                                        <div className="live-player-icon">
                                            🏏
                                        </div>

                                        <h1>
                                            {
                                                currentPlayer.name
                                            }
                                        </h1>

                                        <span className="category-badge">
                                            {
                                                currentPlayer.category
                                            }
                                        </span>

                                    </div>


                                    <div className="live-player-info">

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
                                                {" "}
                                                Lakhs
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                STATUS
                                            </span>

                                            <strong
                                                className={
                                                    currentPlayer.status ===
                                                    "Sold"
                                                        ? "sold-text"
                                                        : currentPlayer.status ===
                                                          "Unsold"
                                                        ? "unsold-text"
                                                        : "available-text"
                                                }
                                            >
                                                {
                                                    currentPlayer.status
                                                }
                                            </strong>

                                        </div>

                                    </div>


                                    {currentPlayer.status ===
                                        "Available" && (

                                        <div className="viewer-status available">

                                            <span>
                                                🟢
                                            </span>

                                            Player is currently
                                            available for bidding

                                        </div>

                                    )}


                                    {currentPlayer.status ===
                                        "Sold" && (

                                        <div className="viewer-status sold">

                                            <span>
                                                🔴
                                            </span>

                                            Player has been sold

                                        </div>

                                    )}


                                    {currentPlayer.status ===
                                        "Unsold" && (

                                        <div className="viewer-status unsold">

                                            <span>
                                                🟡
                                            </span>

                                            Player went unsold

                                        </div>

                                    )}

                                </>

                            ) : (

                                <div className="waiting-auction">

                                    <div className="waiting-icon">
                                        ⏳
                                    </div>

                                    <h2>
                                        Waiting for next player
                                    </h2>

                                    <p>
                                        The admin has not
                                        selected the next
                                        player yet.
                                    </p>

                                </div>

                            )}

                        </div>


                        <div className="viewer-update">

                            <span>
                                🔄
                            </span>

                            Live updates every 3 seconds

                        </div>


                        <div className="viewer-actions">

                            <button
                                className="change-auction-button"
                                onClick={
                                    changeAuction
                                }
                            >
                                🔑 CHANGE AUCTION
                            </button>

                            <button
                                className="back-button"
                                onClick={() =>
                                    navigate(
                                        "/welcome"
                                    )
                                }
                            >
                                ← BACK TO WELCOME
                            </button>

                        </div>

                    </>
                )}


                {message && (

                    <div className="dashboard-message">
                        ❌ {message}
                    </div>

                )}

            </div>

        </div>
    );
}

export default AuctionView;