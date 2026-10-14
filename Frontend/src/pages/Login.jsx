import { useContext, useState,useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { validateEmail } from "../utils/emailValidation";
import { login, getMe } from "../services/auth.service";
import Toast from "../components/Toast";
import { AuthContext } from "../context/ContextAuth.jsx";

import {
  MessageCircle,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Home,
} from "lucide-react";

import "../Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser, setToken } = useContext(AuthContext);
  const [emailError, setEmailError] = useState("");
  const [toast, setToast] = useState({message: "",type: "success",});
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
  if (location.state?.toast) {
    setToast(location.state.toast);

    window.history.replaceState(
      {},
      document.title,
      window.location.pathname
    );
  }
}, [location.state]);

  // =========================
  // LOGIN FUNCTION
  // =========================
  const handleLogin = async (e) => {
  e.preventDefault();

  if (loading) return;

  const validationError = validateEmail(email);

  if (validationError) {
    setEmailError(validationError);
    return;
  }

  setEmailError("");

  try {
    setLoading(true);

    const loginResponse = await login(email, password);
    const token = loginResponse.token;

    setToken(token);

    const meResponse = await getMe(token);
    const user = meResponse.user;

    setUser(user);

    // Show success notification on the Login page
    setToast({
      message: `Welcome back, ${user.name || "user"}!`,
      type: "success",
    });

    // Navigate after the notification disappears
    setTimeout(() => {
      navigate("/chat");
    }, 1000);

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    const status = error.response?.status;

    let message;

    if (status === 401) {
      message = "Invalid email or password.";
    } else if (!error.response) {
      message = "Unable to connect. Please check your internet connection.";
    } else {
      message =
        error.response?.data?.message ||
        "Login failed. Please try again.";
    }

    setToast({
      message,
      type: "error",
    });

  } finally {
    setLoading(false);
  }
};
  // =========================
  // LOGIN UI
  // =========================

  return (
    <div className="auth-page">
      <Toast
  message={toast.message}
  type={toast.type}
  onClose={() =>
    setToast({
      message: "",
      type: "success",
    })
  }
/>
      <div className="auth-box">

        {/* BACK TO HOME BUTTON */}

<div className="auth-home-row">
  <button
    type="button"
    className="auth-home-button"
    onClick={() => navigate("/")}
  >
    <ArrowLeft size={17} />
    <span>Back to Home</span>
    <Home size={17} />
  </button>
</div>

        {/* LOGO */}

        <div className="auth-icon">
           <span className="home-brand-icon"><MessageCircle size={26} /><i /><i /><i /></span>
        </div>*

        {/* HEADING */}

        <h1>Welcome Back</h1>

        <p className="auth-subtitle">
          Login to your real-time chat
        </p>

        {/* LOGIN FORM */}

        <form
          onSubmit={handleLogin}
          className="auth-form"
        >

          {/* EMAIL */}

          <div className="auth-field">
            <label htmlFor="email">
              Email Address
            </label>

            <div className="auth-input-wrapper">
              <Mail size={20} className="auth-input-icon" />

              <input
  id="email"
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  }}
  onBlur={() => {
    setEmailError(validateEmail(email));
  }}
  autoComplete="email"
  required
/>
{emailError && (
  <p className="auth-error" role="alert">
    {emailError}
  </p>
)}
            </div>
          </div>

          {/* PASSWORD */}

          <div className="auth-field">
            <label htmlFor="password">
              Password
            </label>

            <div className="auth-input-wrapper">
              <Lock size={20} className="auth-input-icon" />

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          {/* REMEMBER ME */}

          <div className="auth-options">
            <label className="auth-remember">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>


          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            <span>
              {loading ? "Logging in..." : "Login"}
            </span>

            {!loading && <ArrowRight size={19} />}
          </button>

        </form>

        {/* REGISTER LINK */}

        <div className="auth-footer">
          <span>Don't have an account?</span>

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="auth-link auth-text-button auth-register-link"
          >
            Register
          </button>
        </div>

      </div>
    </div>
  );
}

export default Login;