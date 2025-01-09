import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/SignUp.css";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      userEmail: email,
      userPassword: password,
    };

    try {
      const response = await fetch("http://localhost:3000/users/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("User added successfully:", data);
        // Redirect to the next page
        navigate("/login");  // Update with your next page
      } else {
        console.error("Error during signup:", data.message);
      }
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <div className="logo-sign-up">
          <Link to="/">
            <img src="/logo.png" alt="Logo" />
          </Link>
        </div>
        <h1>Sign up for free!</h1>
        <p>Welcome to Reverse Contact - Let's create your account</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter your password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="create-account-btn">Create account</button>
        </form>
        <div className="or-divider">
          <span className="divider-line"></span>
          <span className="or-text">OR</span>
          <span className="divider-line"></span>
        </div>
        <button type="button" className="google-signup-button">
          <img
            src="/google.png"
            alt="Google"
            className="google-icon"
          />
          <p>Sign in with Google</p>
        </button>
        <p className="terms">
          By signing up, you agree to our <a href="#">Terms of Service</a> and
          our <a href="#">Privacy Policy</a>
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
