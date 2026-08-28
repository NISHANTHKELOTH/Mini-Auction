import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import jsPDF from "jspdf";
import "./AuctionHistory.css";

function AuctionHistory() {
    const navigate = useNavigate();

    const [auctions, setAuctions] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        if (!token) {
            setMessage("Please login first");
            setLoading(false);
            return;
        }

        try {
            const response = await api.get(
                "/auction/history",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setAuctions(
                response.data.auctions || []
            );

        } catch (error) {
            console.log(error);

            setMessage(
                error.response?.data?.message ||
                "Failed to load auction history"
            );

        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = (auction) => {
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
            `Auction ID: ${auction.auctionId}`,
            20,
            y
        );

        y += 7;

        doc.text(
            `Status: ${auction.auctionStatus}`,
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
            `Maximum Purse: Rs. ${(
                auction.maxPurse /
                10000000
            ).toFixed(2)} Cr`,
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

        teams.forEach(
            (team, teamIndex) => {

                if (y > 260) {
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
                    `Remaining Purse: Rs. ${(
                        team.purse /
                        10000000
                    ).toFixed(2)} Cr`,
                    25,
                    y
                );

                y += 7;

                doc.text(
                    `Players Bought: ${
                        team.players?.length || 0
                    }`,
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

                            if (y > 260) {
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
                                `Category: ${
                                    player.category ||
                                    "N/A"
                                }`,
                                35,
                                y
                            );

                            y += 6;

                            doc.text(
                                `Cost: Rs. ${(
                                    player.cost /
                                    100000
                                ).toFixed(2)} Lakhs`,
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

        if (y > 260) {
            doc.addPage();
            y = 20;
        }

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
            `${auction.name || "Auction"}-${auction.auctionId}.pdf`
                .replace(
                    /[^a-z0-9-_]/gi,
                    "_"
                );

        doc.save(fileName);
    };

    return (
        <div className="history-page">

            <div className="history-container">

                <div className="history-header">

                    <h1>
                        🏆 Auction History
                    </h1>

                    <p>
                        View your previous auctions
                    </p>

                </div>

                {loading && (
                    <div className="history-message">
                        Loading auction history...
                    </div>
                )}

                {!loading &&
                    auctions.length === 0 &&
                    !message && (
                        <div className="history-empty">
                            <h2>
                                📭 No Auction History
                            </h2>

                            <p>
                                Your completed auctions
                                will appear here.
                            </p>
                        </div>
                    )}

                {!loading &&
                    auctions.length > 0 && (

                    <div className="history-grid">

                        {auctions.map(
                            (auction) => (

                                <div
                                    className="history-card"
                                    key={
                                        auction._id
                                    }
                                >

                                    <div className="history-card-header">

                                        <div>

                                            <h2>
                                                🏆{" "}
                                                {auction.name}
                                            </h2>

                                            <p>
                                                ID:{" "}
                                                <strong>
                                                    {
                                                        auction.auctionId
                                                    }
                                                </strong>
                                            </p>

                                        </div>

                                        <span
                                            className={
                                                auction.auctionStatus ===
                                                "Finished"
                                                    ? "finished-badge"
                                                    : "live-badge"
                                            }
                                        >
                                            {auction.auctionStatus}
                                        </span>

                                    </div>


                                    <div className="history-details">

                                        <div>
                                            <span>
                                                TEAMS
                                            </span>

                                            <strong>
                                                {
                                                    auction.teams?.length ||
                                                    0
                                                }
                                                {" / "}
                                                {
                                                    auction.teamsCount
                                                }
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                PURSE
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

                                        <div>
                                            <span>
                                                CREATED
                                            </span>

                                            <strong>
                                                {auction.createdAt
                                                    ? new Date(
                                                          auction.createdAt
                                                      ).toLocaleDateString()
                                                    : "N/A"}
                                            </strong>
                                        </div>

                                    </div>


                                    <div className="history-actions">

                                        <button
                                            onClick={() => {
                                                localStorage.setItem(
                                                    "auctionId",
                                                    auction.auctionId
                                                );

                                                navigate(
                                                    "/auction-view"
                                                );
                                            }}
                                        >
                                            👀 VIEW
                                        </button>

                                        <button
                                            className="pdf-history-button"
                                            onClick={() =>
                                                downloadPDF(
                                                    auction
                                                )
                                            }
                                        >
                                            📄 DOWNLOAD PDF
                                        </button>

                                    </div>

                                </div>

                            )
                        )}

                    </div>
                )}


                {message && (
                    <div className="history-error">
                        ❌ {message}
                    </div>
                )}


                <button
                    className="history-back-button"
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

export default AuctionHistory;