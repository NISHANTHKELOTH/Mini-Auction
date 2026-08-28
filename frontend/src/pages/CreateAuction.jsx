import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./CreateAuction.css";

function CreateAuction() {
    const [name, setName] = useState("");
    const [maxPurse, setMaxPurse] = useState("");
    const [teamsCount, setTeamsCount] = useState("");
    const [auction, setAuction] = useState(null);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleCreate = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const token = localStorage.getItem("token");

            const response = await api.post(
                "/auction/create",
                {
                    name,
                    maxPurse:
                        Number(maxPurse) * 10000000,
                    teamsCount:
                        Number(teamsCount)
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            const createdAuction =
                response.data.auction;

            localStorage.setItem(
                "auctionId",
                createdAuction.auctionId
            );

            setAuction(createdAuction);

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Failed to create auction"
            );
        }
    };

    if (auction) {
        return (
            <div className="create-auction-page">

                <div className="create-glow glow-one"></div>
                <div className="create-glow glow-two"></div>

                <div className="create-auction-card auction-created">

                    <div className="create-logo">
                        🎉
                    </div>

                    <h1>
                        Auction Created!
                    </h1>

                    <p className="created-subtitle">
                        You are now the admin of this auction.
                    </p>

                    <h2>
                        {auction.name}
                    </h2>

                    <div className="auction-id-box">

                        <span>
                            AUCTION ID
                        </span>

                        <strong>
                            {auction.auctionId}
                        </strong>

                        <p>
                            Share this ID with the
                            captains who want to join.
                        </p>

                    </div>

                    <div className="auction-details">

                        <div className="auction-detail">

                            <span>
                                💰 Maximum Purse
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

                        <div className="auction-detail">

                            <span>
                                👥 Number of Teams
                            </span>

                            <strong>
                                {auction.teamsCount}
                            </strong>

                        </div>

                    </div>

                    <div className="create-actions">

                        <button
                            className="create-primary-button"
                            onClick={() =>
                                navigate(
                                    "/admin-dashboard"
                                )
                            }
                        >
                            👑 Go to Admin Dashboard
                        </button>

                        <button
                            className="create-secondary-button"
                            onClick={() =>
                                navigate("/welcome")
                            }
                        >
                            ← Back to Welcome
                        </button>

                    </div>

                </div>

            </div>
        );
    }

    return (
        <div className="create-auction-page">

            <div className="create-glow glow-one"></div>
            <div className="create-glow glow-two"></div>

            <div className="create-auction-card">

                <div className="create-logo">
                    🏆
                </div>

                <h1>
                    Create Auction
                </h1>

                <p className="create-subtitle">
                    Set up your auction and start building
                    your dream teams.
                </p>

                <form onSubmit={handleCreate}>

                    <div className="create-form-group">

                        <label>
                            Auction Name
                        </label>

                        <input
                            type="text"
                            placeholder="Example: IPL Mini Auction"
                            value={name}
                            onChange={(e) =>
                                setName(
                                    e.target.value
                                )
                            }
                            required
                        />

                    </div>

                    <div className="create-form-group">

                        <label>
                            Maximum Purse (Crores)
                        </label>

                        <input
                            type="number"
                            min="1"
                            step="0.1"
                            placeholder="Example: 50"
                            value={maxPurse}
                            onChange={(e) =>
                                setMaxPurse(
                                    e.target.value
                                )
                            }
                            required
                        />

                    </div>

                    <div className="create-form-group">

                        <label>
                            Number of Teams
                        </label>

                        <input
                            type="number"
                            min="2"
                            placeholder="Example: 8"
                            value={teamsCount}
                            onChange={(e) =>
                                setTeamsCount(
                                    e.target.value
                                )
                            }
                            required
                        />

                    </div>

                    <button
                        className="create-submit-button"
                        type="submit"
                    >
                        🚀 CREATE AUCTION
                    </button>

                </form>

                {message && (
                    <div className="create-message">
                        ❌ {message}
                    </div>
                )}

                <div className="create-divider"></div>

                <button
                    className="create-back-button"
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

export default CreateAuction;