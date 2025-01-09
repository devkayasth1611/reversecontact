import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("Both email and password are required.");
      return;
    }

    // Basic email format check
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    // Password length check (you can adjust the length as per your requirements)
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: email,
          userPassword: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data in localStorage or a state management solution
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect to the profile-lookup page or dashboard
        navigate("/profile-lookup");
      } else {
        setErrorMessage(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-logo-container">
        <img
          src="logo.png" // Replace with the actual logo path
          alt="Logo"
          className="login-logo"
        />
      </div>
      <span className="welcome-heading">Welcome back!</span>
      <p className="subheading">Let's turn any email into a business opportunity</p>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="email"
          className="email-input"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="email-input"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-button" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="login-or-divider">
          <span className="login-divider-line"></span>
          <span className="login-or-text">OR</span>
          <span className="login-divider-line"></span>
        </div>
        <button type="button" className="google-login-button">
          <img
            src="/google.png" // Replace with the Google icon path
            alt="Google"
            className="google-icon"
          />
          <p>Sign in with Google</p>
        </button>
      </form>
      <p className="signup-text">
        Need an account? <a href="/signup">Sign up here</a>
      </p>
    </div>
  );
}

export default Login;
