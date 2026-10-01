import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    login,
    getMe
} from "../services/auth.service";

import { AuthContext } from "../context/ContextAuth.jsx";

import {
    MessageCircle,
    Mail,
    Lock,
    ArrowRight
} from "lucide-react";


function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {
        setUser,
        setToken
    } = useContext(AuthContext);

    const navigate = useNavigate();


    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            // 1. Login
            const loginResponse =
                await login(email, password);


            // 2. Get JWT
            const token =
                loginResponse.token;

            console.log("TOKEN:", token);


            // 3. Store token
            setToken(token);


            // 4. Get logged-in user
            const meResponse =
                await getMe(token);


            // 5. Store user
            const user =
                meResponse.user;

            setUser(user);


            // 6. Move to Chat
            navigate("/chat");

            alert("Login successful!");

        } catch (error) {

            console.log(
                "LOGIN ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    };


    return (

        <div className="
            min-h-screen
            bg-slate-100
            flex
            items-center
            justify-center
            px-4
        ">

            <div className="
                w-full
                max-w-md
                bg-white
                rounded-3xl
                shadow-xl
                border
                border-slate-200
                p-8
            ">

                {/* =========================
                    LOGO
                ========================== */}

                <div className="
                    flex
                    flex-col
                    items-center
                    mb-8
                ">

                    <div className="
                        w-16
                        h-16
                        rounded-2xl
                        bg-indigo-600
                        flex
                        items-center
                        justify-center
                        shadow-lg
                        mb-4
                    ">

                        <MessageCircle
                            size={34}
                            className="text-white"
                        />

                    </div>


                    <h1 className="
                        text-3xl
                        font-bold
                        text-slate-900
                    ">
                        Welcome Back
                    </h1>


                    <p className="
                        text-slate-500
                        mt-2
                        text-sm
                    ">
                        Login to your real-time chat
                    </p>

                </div>


                {/* =========================
                    LOGIN FORM
                ========================== */}

                <form
                    onSubmit={handleLogin}
                    className="space-y-5"
                >

                    {/* EMAIL */}

                    <div>

                        <label className="
                            block
                            text-sm
                            font-medium
                            text-slate-700
                            mb-2
                        ">
                            Email
                        </label>


                        <div className="
                            relative
                        ">

                            <Mail
                                size={20}
                                className="
                                    absolute
                                    left-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-400
                                "
                            />


                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                className="
                                    w-full
                                    pl-11
                                    pr-4
                                    py-3
                                    border
                                    border-slate-300
                                    rounded-xl
                                    outline-none
                                    text-slate-900
                                    placeholder:text-slate-400
                                    focus:border-indigo-500
                                    focus:ring-2
                                    focus:ring-indigo-100
                                    transition
                                "
                            />

                        </div>

                    </div>


                    {/* PASSWORD */}

                    <div>

                        <label className="
                            block
                            text-sm
                            font-medium
                            text-slate-700
                            mb-2
                        ">
                            Password
                        </label>


                        <div className="
                            relative
                        ">

                            <Lock
                                size={20}
                                className="
                                    absolute
                                    left-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-400
                                "
                            />


                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                className="
                                    w-full
                                    pl-11
                                    pr-4
                                    py-3
                                    border
                                    border-slate-300
                                    rounded-xl
                                    outline-none
                                    text-slate-900
                                    placeholder:text-slate-400
                                    focus:border-indigo-500
                                    focus:ring-2
                                    focus:ring-indigo-100
                                    transition
                                "
                            />

                        </div>

                    </div>


                    {/* LOGIN BUTTON */}

                    <button
                        type="submit"
                        className="
                            w-full
                            py-3
                            bg-indigo-600
                            hover:bg-indigo-700
                            text-white
                            font-semibold
                            rounded-xl
                            flex
                            items-center
                            justify-center
                            gap-2
                            shadow-md
                            hover:shadow-lg
                            transition
                            duration-200
                            cursor-pointer
                        "
                    >

                        Login

                        <ArrowRight
                            size={19}
                        />

                    </button>

                </form>


                {/* =========================
                    REGISTER
                ========================== */}

                <div className="
                    mt-7
                    text-center
                    text-sm
                    text-slate-500
                ">

                    <span>
                        Don't have an account?
                    </span>


                    <button
                        type="button"
                        onClick={() =>
                            navigate("/register")
                        }
                        className="
                            ml-1
                            text-indigo-600
                            font-semibold
                            hover:text-indigo-700
                            hover:underline
                            cursor-pointer
                        "
                    >
                        Register
                    </button>

                </div>

            </div>

        </div>
    );
}


export default Login;