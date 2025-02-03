import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/SignUp.css";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [error, setError] = useState(""); // State for error message
  const [captchaError, setCaptchaError] = useState(""); // State for captcha error
  const navigate = useNavigate();

  // Generate a random CAPTCHA code
  const generateCaptcha = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setCaptcha(result);
  };

  // Initialize CAPTCHA on component mount
  React.useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Field validation
    if (!email || !password || !companyName || !phoneNumber || !captchaInput) {
      setError("All fields are mandatory.");
      return;
    }

    // CAPTCHA validation
    if (captchaInput !== captcha) {
      setCaptchaError("CAPTCHA does not match.");
      return;
    }

    const userData = {
      userEmail: email,
      userPassword: password,
      companyName,
      phoneNumber,
      roleId: 1,
    };

    try {
      const response = await fetch("http://localhost:3000/users/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user email temporarily in session storage
        sessionStorage.setItem("userEmail", email);

        // Reset form and navigate to login
        setEmail("");
        setPassword("");
        setCompanyName("");
        setPhoneNumber("");
        setCaptchaInput("");
        setError("");
        setCaptchaError("");
        generateCaptcha(); // Refresh CAPTCHA
        navigate("/login");
      } else if (response.status === 409) {
        // Handle duplicate email error
        setError("User already exists.");
      } else {
        setError(data.message || "An error occurred during signup.");
      }
    } catch (err) {
      setError("Error during signup. Please try again.");
    }
  };

  const handlePhoneNumberChange = (e) => {
    const input = e.target.value;
    if (/^\d*$/.test(input) && input.length <= 10) {
      setPhoneNumber(input);
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
          {error && <h3 className="error-message">{error}</h3>}
          {captchaError && <h3 className="error-message">{captchaError}</h3>}
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
          <input
            type="text"
            placeholder="Enter your company name"
            className="input-field"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter your phone number"
            className="input-field"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
          />
          <div className="captcha-section">
            <p className="captcha-text">CAPTCHA: {captcha}</p>
            <input
              type="text"
              placeholder="Enter CAPTCHA"
              className="input-field"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
            />
          </div>
          <button type="submit" className="create-account-btn">
            Create account
          </button>
        </form>
        <div className="or-divider">
          <span className="divider-line"></span>
          <span className="or-text">OR</span>
          <span className="divider-line"></span>
        </div>
        <button type="button" className="google-signup-button">
          <img src="/google.png" alt="Google" className="google-icon" />
          <p>Sign in with Google</p>
        </button>
        <p className="terms">
          By signing up, you agree to our <a href="#">Terms of Service</a> and
          our <a href="#">Privacy Policy</a>.
        </p>
        <p className="login-link">
          Already have an account? <a href="/login">Log in</a>
        </p>
      </div>
      <div className="signup-right">
        <h2>
          Turn emails into
          <br /> LinkedIn data.
        </h2>
        <p>
          Find easily reliable professional
          <br /> information about a person and
          <br /> their companies based on their personal
          <br /> or professional email address.
        </p>
      </div>
    </div>
  );
};

export default SignUp;
