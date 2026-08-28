import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Welcome from "./pages/Welcome";
import CreateAuction from "./pages/CreateAuction";
import JoinAuction from "./pages/JoinAuction";
import CaptainDashboard from "./pages/CaptainDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AuctionView from "./pages/AuctionView";
import AuctionHistory from "./pages/AuctionHistory";

import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/signup"
                    element={<Signup />}
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                <Route
                    path="/reset-password/:token"
                    element={<ResetPassword />}
                />

                <Route
                    path="/welcome"
                    element={<Welcome />}
                />

                <Route
                    path="/create-auction"
                    element={<CreateAuction />}
                />

                <Route
                    path="/join-auction"
                    element={<JoinAuction />}
                />

                <Route
                    path="/captain-dashboard"
                    element={<CaptainDashboard />}
                />

                <Route
                    path="/admin-dashboard"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/auction-view"
                    element={<AuctionView />}
                />

                <Route
                    path="/auction-history"
                    element={<AuctionHistory />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;