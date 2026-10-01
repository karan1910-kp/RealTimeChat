import {
    createContext,
    useEffect,
    useState
} from "react";

import {
    getMe
} from "../services/auth.service";

const AuthContext = createContext();

function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const checkUser = async () => {

            if (!token) {
                setLoading(false);
                return;
            }

            try {

                const response = await getMe(token);

                setUser(response.user);

            } catch (error) {

                console.log(
                    "Auth Check Error:",
                    error.response?.data?.message ||
                    error.message
                );

                localStorage.removeItem("token");

                setToken(null);
                setUser(null);

            } finally {

                setLoading(false);

            }
        };

        checkUser();

    }, [token]);


    const saveToken = (newToken) => {

        localStorage.setItem(
            "token",
            newToken
        );

        setToken(newToken);
    };


    const logoutUser = () => {

        localStorage.removeItem("token");

        setToken(null);
        setUser(null);
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                token,
                setToken: saveToken,
                loading,
                logoutUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export {
    AuthContext,
    AuthProvider
};