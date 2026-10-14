import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

// Pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Chat from "../pages/Chat";
import Profile from "../pages/profile";

// Protected route
import ProtectedRoute from "./ProtectedRoutes";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                {/* HOME PAGE */}
                <Route
                    path="/"
                    element={<Home />}
                />

                {/* LOGIN PAGE */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* REGISTER PAGE */}
                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* PROTECTED CHAT PAGE */}
                <Route
                    path="/chat"
                    element={
                        <ProtectedRoute>
                            <Chat />
                        </ProtectedRoute>
                    }
                />

                {/* PROFILE PAGE */}
                <Route
                    path="/profile"
                    element={<Profile />}
                />

                {/* UNKNOWN URL */}
                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;