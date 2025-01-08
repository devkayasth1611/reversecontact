import React from "react";
import { Link } from "react-router-dom";
import "../css/Login.css"; // External CSS file

function Login() {
  return (
    <div className="login-container">
      <div className="login-logo-container">
        <Link to="/">
        <img
          src="logo.png" // Replace with the actual logo path
          alt="Logo"
          className="login-logo"
        />
        </Link>
      </div>
      <span className="welcome-heading">Welcome back !</span>
      <p className="subheading">Let's turn any email into business opportunity</p>
      <form className="login-form">
        <input
          type="email"
          className="email-input"
          placeholder="Enter your email"
        />
        <button type="submit" className="login-button">
          Log in
        </button>
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
