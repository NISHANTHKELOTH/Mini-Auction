import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./ForgotPassword.css";

function ForgotPassword() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [resetLink, setResetLink] = useState("");
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        setMessage("");
        setResetLink("");

        if (!email.trim()) {
            setMessage("Please enter your email");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post(
                "/auth/forgot-password",
                {
                    email: email.trim()
                }
            );

            setMessage(
                response.data.message ||
                "Reset link generated successfully"
            );

            setResetLink(
                response.data.resetLink || ""
            );

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Failed to generate reset link"
            );
        } finally {
            setLoading(false);
        }
    };

    const openResetLink = () => {
        if (resetLink) {
            navigate(
                resetLink.replace(
                    "http://localhost:5173",
                    ""
                )
            );
        }
    };

    return (
        <div className="forgot-page">

            <div className="forgot-card">

                <div className="forgot-icon">
                    🔐
                </div>

                <h1>
                    Forgot Password?
                </h1>

                <p className="forgot-description">
                    Enter your registered email address
                    and we'll help you reset your password.
                </p>

                <form
                    onSubmit={
                        handleForgotPassword
                    }
                >

                    <div className="form-group">

                        <label>
                            EMAIL ADDRESS
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            disabled={loading}
                            onChange={(e) =>
                                setEmail(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "GENERATING..."
                            : "🔑 RESET PASSWORD"}
                    </button>

                </form>

                {message && (
                    <div className="forgot-message">
                        {message}
                    </div>
                )}

                {resetLink && (
                    <div className="reset-link-box">

                        <p>
                            🔗 Your reset link:
                        </p>

                        <button
                            type="button"
                            onClick={
                                openResetLink
                            }
                        >
                            OPEN RESET PASSWORD
                        </button>

                    </div>
                )}

                <button
                    className="back-login-button"
                    onClick={() =>
                        navigate("/")
                    }
                >
                    ← BACK TO LOGIN
                </button>

            </div>

        </div>
    );
}

export default ForgotPassword;