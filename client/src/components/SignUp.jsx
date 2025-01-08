import React from "react";
import { Link } from "react-router-dom";
import "../css/SignUp.css";

const SignUp = () => {
  return (
    <div className="signup-container">
      <div className="signup-left">
        <div className="logo-sign-up">
          <Link to="/">
            <img src="/logo.png" alt="Logo" /> {/* Adjust the path if needed */}
          </Link>
        </div>
        <h1>Sign up for free!</h1>
        <p>Welcome to Reverse Contact - Let's create your account</p>
        <input
          type="email"
          placeholder="Enter your email"
          className="input-field"
        />
        <input
          type="password"
          placeholder="Enter your password"
          className="input-field"
        />
        <button className="create-account-btn" onClick={handleSignUp}>Create account</button>
        <div className="or-divider">
          <span className="divider-line"></span>
          <span className="or-text">OR</span>
          <span className="divider-line"></span>
        </div>
        <button type="button" className="google-signup-button">
          <img
            src="/google.png" // Replace with the Google icon path
            alt="Google"
            className="google-icon"
          />
          <p>Sign in with Google</p>
        </button>
        <p className="terms">
          By signing up, you agree to our <a href="#">Terms of Service</a> and
          our
          <a href="#"> Privacy Policy</a>
        </p>
        <p className="login-link">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
      <div className="signup-right">
        <h2>Turn emails into LinkedIn data.</h2>
        <p>
          Find easily reliable professional information about a person and their
          companies based on their personal or professional email address.
        </p>
      </div>
    </div>
  );
};

export default SignUp;
