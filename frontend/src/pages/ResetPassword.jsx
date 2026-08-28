import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./ResetPassword.css";

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();

        setMessage("");
        setSuccess(false);

        if (!password || !confirmPassword) {
            setMessage("Please fill all fields");
            return;
        }

        if (password.length < 6) {
            setMessage(
                "Password must be at least 6 characters"
            );
            return;
        }

        if (password !== confirmPassword) {
            setMessage(
                "Passwords do not match"
            );
            return;
        }

        try {
            setLoading(true);

            const response = await api.post(
                `/auth/reset-password/${token}`,
                {
                    password
                }
            );

            setMessage(
                response.data.message ||
                "Password reset successfully"
            );

            setSuccess(true);
            setPassword("");
            setConfirmPassword("");

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Failed to reset password"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-page">

            <div className="reset-card">

                <div className="reset-icon">
                    🔑
                </div>

                <h1>
                    Reset Password
                </h1>

                <p className="reset-description">
                    Create a new password for your
                    Mini Auction account.
                </p>

                {!success ? (

                    <form
                        onSubmit={
                            handleResetPassword
                        }
                    >

                        <div className="form-group">

                            <label>
                                NEW PASSWORD
                            </label>

                            <input
                                type="password"
                                placeholder="Enter new password"
                                value={password}
                                disabled={loading}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                CONFIRM PASSWORD
                            </label>

                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                disabled={loading}
                                onChange={(e) =>
                                    setConfirmPassword(
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
                                ? "RESETTING..."
                                : "🔐 RESET PASSWORD"}
                        </button>

                    </form>

                ) : (

                    <button
                        className="login-button"
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        🔐 GO TO LOGIN
                    </button>

                )}

                {message && (
                    <div
                        className={
                            success
                                ? "reset-message success"
                                : "reset-message"
                        }
                    >
                        {success
                            ? "✅ "
                            : "❌ "}
                        {message}
                    </div>
                )}

                {!success && (
                    <button
                        className="back-login-button"
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        ← BACK TO LOGIN
                    </button>
                )}

            </div>

        </div>
    );
}

export default ResetPassword;