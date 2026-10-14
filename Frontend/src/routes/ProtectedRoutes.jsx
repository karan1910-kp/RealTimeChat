import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/ContextAuth";
import LoadingScreen from "../components/Loadingscreen";

function ProtectedRoute({ children }) {

    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <LoadingScreen />;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;