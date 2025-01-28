import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../css/UserList.css";

const AddUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const userEmail = JSON.parse(localStorage.getItem("user"))?.email || "Guest";

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      window.location.href = "/login";
    }
  }, []);
  // Check roleId on page load
  useEffect(() => {
    const roleId = localStorage.getItem("roleId");
    if (roleId !== "1") {
      // If the user is not an admin (roleId is not 1), redirect them
      navigate("/profile-lookup"); // Redirect to profile page for non-admin users
    }
  }, [navigate]);

  const handleAddUser = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setErrorMessage("Both email and password are required.");
      return;
    }

    setIsSubmitting(true);

    const userData = {
      userEmail: email,
      userPassword: password,
      roleId: 2, // Assign role ID for regular user
    };

    try {
      const response = await fetch("http://localhost:3000/users/newuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("User added successfully:", data);
        navigate("/user-list"); // Redirect after successful user addition
      } else {
        setErrorMessage(data.message || "Error adding user.");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      setErrorMessage(
        "An error occurred while adding the user. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="dashboard">
        <Sidebar userEmail={userEmail} />

        <div className="main-content">
          <div className="header">
            <h1 className="profile-lookup">Add User</h1>
          </div>

          <div className="add-user-form-container">
            <form onSubmit={handleAddUser}>
              <div>
                <input
                  type="email"
                  placeholder="Enter user email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Enter user password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <div>
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddUser;
