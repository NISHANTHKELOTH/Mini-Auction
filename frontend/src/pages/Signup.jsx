import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Signup.css";

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            await api.post("/auth/register", {
                name,
                email,
                password
            });

            navigate("/");

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Signup failed"
            );
        }
    };

    return (
        <div className="signup-page">

            <div className="signup-card">

                <div className="signup-logo">
                    🏆
                </div>

                <h1>
                    Mini Auction
                </h1>

                <p className="signup-subtitle">
                    Create your account and join the auction.
                </p>

                <form onSubmit={handleSignup}>

                    <div className="signup-form-group">

                        <label>
                            Name
                        </label>

                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            required
                        />

                    </div>

                    <div className="signup-form-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />

                    </div>

                    <div className="signup-form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                    </div>

                    <button
                        className="signup-submit-button"
                        type="submit"
                    >
                        🚀 Create Account
                    </button>

                </form>

                {message && (
                    <div className="signup-message">
                        {message}
                    </div>
                )}

                <div className="signup-divider">
                    <span>OR</span>
                </div>

                <p className="login-text">
                    Already have an account?
                </p>

                <button
                    className="login-button"
                    onClick={() =>
                        navigate("/")
                    }
                >
                    🔐 Back to Login
                </button>

            </div>

        </div>
    );
}

export default Signup;