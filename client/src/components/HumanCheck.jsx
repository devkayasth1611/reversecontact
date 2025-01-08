import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HumanCheck = () => {
  const [isHuman, setIsHuman] = useState(false);
  const email = localStorage.getItem("userEmail"); // Fetch email from local storage
  const navigate = useNavigate();

  const handleCheck = (e) => {
    setIsHuman(e.target.checked);
  };

  const handleVerify = async () => {
    if (!isHuman) {
      alert("Please verify you are human!");
      return;
    }

    if (!email) {
      alert("Email not found! Please sign up first.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/users/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: email }),
      });

      if (response.ok) {
        alert("Verification email sent successfully! Please check your inbox.");
        navigate("/profile-lookup"); // Redirect to the profile-lookup page
      } else {
        const errorData = await response.json();
        console.error("Backend error:", errorData.message);
        alert("Failed to send email. Please try again.");
      }
    } catch (error) {
      console.error("Request error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="human-check-container">
      <h2>Human Verification</h2>
      <p>Please confirm that you are not a robot to proceed.</p>
      <div className="checkbox-container">
        <input
          type="checkbox"
          id="humanCheck"
          checked={isHuman}
          onChange={handleCheck}
        />
        <label htmlFor="humanCheck">I am not a robot</label>
      </div>
      <button className="verify-button" onClick={handleVerify}>
        Verify and Proceed
      </button>
    </div>
  );
};

export default HumanCheck;
