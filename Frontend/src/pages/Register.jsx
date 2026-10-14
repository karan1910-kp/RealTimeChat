import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "../utils/emailValidation";
import { register } from "../services/auth.service";
import Toast from "../components/Toast";
import {
  MessageCircle,
  User,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Home,
} from "lucide-react";

import "../Auth.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [toast, setToast] = useState({message: "",type: "success",});

  const navigate = useNavigate();

  // =========================
  // REGISTER FUNCTION
  // =========================
const handleRegister = async (e) => {
  e.preventDefault();

  if (loading) return;

  const validationError = validateEmail(email);

  if (validationError) {
    setEmailError(validationError);
    setToast({
      message: validationError,
      type: "error",
    });
    return;
  }

  setEmailError("");

  if (!name.trim()) {
    setToast({
      message: "Please enter your full name.",
      type: "error",
    });
    return;
  }

  if (!password) {
    setToast({
      message: "Please create a password.",
      type: "error",
    });
    return;
  }

  try {
    setLoading(true);

    await register(name.trim(), email, password);

    navigate("/login", {
      state: {
        toast: {
          message: "Your account has been created successfully!",
          type: "success",
        },
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    const status = error.response?.status;

    let message;

    if (status === 409) {
      message = "This email is already registered.";
    } else if (!error.response) {
      message = "Unable to connect. Please check your internet connection.";
    } else {
      message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
    }

    setToast({
      message,
      type: "error",
    });
  } finally {
    setLoading(false);
  }
};  // =========================
  // REGISTER UI
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
        </div>

        {/* HEADING */}

        <h1>Create Account</h1>

        <p className="auth-subtitle">
          Join our real-time chat
        </p>

        {/* REGISTER FORM */}

        <form
          onSubmit={handleRegister}
          className="auth-form"
        >

          {/* NAME */}

          <div className="auth-field">
            <label htmlFor="register-name">
              Full Name
            </label>

            <div className="auth-input-wrapper">
              <User
                size={20}
                className="auth-input-icon"
              />

              <input
                id="register-name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                autoComplete="name"
                required
              />
            </div>
          </div>

          {/* EMAIL */}

          <div className="auth-field">
            <label htmlFor="register-email">
              Email Address
            </label>

            <div className="auth-input-wrapper">
              <Mail
                size={20}
                className="auth-input-icon"
              />

              <input
  id="register-email"
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
            <label htmlFor="register-password">
              Password
            </label>

            <div className="auth-input-wrapper">
              <Lock
                size={20}
                className="auth-input-icon"
              />

              <input
                id="register-password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          {/* REGISTER BUTTON */}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            <span>
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </span>

            {!loading && (
              <ArrowRight size={19} />
            )}
          </button>

        </form>

        {/* LOGIN LINK */}

        <div className="auth-footer">
          <span>Already registered?</span>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="auth-link auth-text-button auth-register-link"
          >
            Login
          </button>
        </div>

      </div>
    </div>
  );
}

export default Register;