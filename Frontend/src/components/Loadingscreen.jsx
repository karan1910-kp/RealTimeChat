import { MessageCircle } from "lucide-react";
import "../Auth.css";

function LoadingScreen() {
    return (
        <div className="loading-screen">
            <div className="loading-content">

                <div className="loading-logo">
                    <MessageCircle size={36} />
                </div>

                <div className="loading-spinner"></div>

                <h2>Restoring your session</h2>

                <p>Please wait while we connect you...</p>

            </div>
        </div>
    );
}

export default LoadingScreen;