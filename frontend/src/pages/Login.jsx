import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await api.post("/auth/login", {
                email,
                password
            });

            localStorage.setItem(
                "token",
                response.data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            navigate("/welcome");

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    };

    return (
        <div className="login-page">

            <div className="login-card">

                <div className="login-logo">
                    🏆
                </div>

                <h1>
                    Mini Auction
                </h1>

                <p className="login-subtitle">
                    Welcome back! Login to continue.
                </p>

                <form onSubmit={handleLogin}>

                    <div className="login-form-group">

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

                    <div className="login-form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                    </div>

                    <div className="forgot-password">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/forgot-password"
                                )
                            }
                        >
                            Forgot Password?
                        </button>

                    </div>

                    <button
                        className="login-button"
                        type="submit"
                    >
                        🔐 Login
                    </button>

                </form>

                {message && (
                    <div className="login-message">
                        {message}
                    </div>
                )}

                <div className="login-divider">
                    <span>OR</span>
                </div>

                <p className="signup-text">
                    Don't have an account?
                </p>

                <button
                    className="signup-button"
                    onClick={() =>
                        navigate("/signup")
                    }
                >
                    Create Account
                </button>

            </div>

        </div>
    );
}

export default Login;