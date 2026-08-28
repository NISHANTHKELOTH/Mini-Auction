import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./JoinAuction.css";

function JoinAuction() {
    const [auctionId, setAuctionId] = useState("");
    const [teamName, setTeamName] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleJoin = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const token = localStorage.getItem("token");

            await api.post(
                "/auction/join",
                {
                    auctionId: auctionId.trim(),
                    teamName: teamName.trim()
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            localStorage.setItem(
                "auctionId",
                auctionId.trim()
            );

            navigate("/welcome");

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Failed to join auction"
            );
        }
    };

    return (
        <div className="join-auction-page">

            <div className="join-glow join-glow-one"></div>
            <div className="join-glow join-glow-two"></div>

            <div className="join-auction-card">

                <div className="join-logo">
                    🤝
                </div>

                <h1>
                    Join Auction
                </h1>

                <p className="join-subtitle">
                    Enter the auction details and choose
                    your team name to join.
                </p>

                <form onSubmit={handleJoin}>

                    <div className="join-form-group">

                        <label>
                            Auction ID
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
                            required
                        />

                        <span className="input-hint">
                            Get the Auction ID from the admin.
                        </span>

                    </div>

                    <div className="join-form-group">

                        <label>
                            Team Name
                        </label>

                        <input
                            type="text"
                            placeholder="Example: Chennai Super Kings"
                            value={teamName}
                            onChange={(e) =>
                                setTeamName(
                                    e.target.value
                                )
                            }
                            required
                        />

                    </div>

                    <button
                        className="join-submit-button"
                        type="submit"
                    >
                        🚀 JOIN AUCTION
                    </button>

                </form>

                {message && (
                    <div className="join-message">
                        ❌ {message}
                    </div>
                )}

                <div className="join-divider"></div>

                <button
                    className="join-back-button"
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

export default JoinAuction;