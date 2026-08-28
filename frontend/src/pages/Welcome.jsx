import { useNavigate } from "react-router-dom";
import "./Welcome.css";

function Welcome() {
    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("auctionId");

        navigate("/");
    };

    return (
        <div className="welcome-page">

            <div className="welcome-glow glow-one"></div>
            <div className="welcome-glow glow-two"></div>

            <div className="welcome-card">

                <div className="welcome-logo">
                    🏆
                </div>

                <h1>
                    Mini Auction
                </h1>

                <h2>
                    Welcome, {user?.name || "User"}!
                </h2>

                <p className="welcome-description">
                    Create or join an auction and build
                    your dream team.
                </p>

                <div className="welcome-actions">

                    {/* CREATE AUCTION */}

                    <button
                        className="welcome-button primary"
                        onClick={() =>
                            navigate("/create-auction")
                        }
                    >
                        ➕ Create Auction
                    </button>


                    {/* JOIN AUCTION */}

                    <button
                        className="welcome-button"
                        onClick={() =>
                            navigate("/join-auction")
                        }
                    >
                        🤝 Join Auction
                    </button>


                    {/* CAPTAIN DASHBOARD */}

                    <button
                        className="welcome-button"
                        onClick={() =>
                            navigate("/captain-dashboard")
                        }
                    >
                        👨‍✈️ Captain Dashboard
                    </button>


                    {/* WATCH AUCTION */}

                    <button
                        className="welcome-button"
                        onClick={() =>
                            navigate("/auction-view")
                        }
                    >
                        👀 Watch Auction
                    </button>

                </div>


                <div className="welcome-divider"></div>


                {/* AUCTION HISTORY */}

                <div className="history-section">

                    <h3>
                        📜 Auction History
                    </h3>

                    <p>
                        View your previous and ongoing auctions.
                    </p>

                    <button
                        className="history-button"
                        onClick={() =>
                            navigate("/auction-history")
                        }
                    >
                        📋 View History
                    </button>

                </div>


                <div className="welcome-divider"></div>


                {/* LOGOUT */}

                <button
                    className="logout-button"
                    onClick={logout}
                >
                    🚪 Logout
                </button>

            </div>

        </div>
    );
}

export default Welcome;