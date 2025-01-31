import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../css/UserList.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creditUpdates, setCreditUpdates] = useState({});

  const userEmail = JSON.parse(localStorage.getItem("user"))?.email || "Guest";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/users/user");

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const { data } = await response.json();

        // Filter users based on the logged-in user's email
        const filteredUsers = data.filter(
          (user) => user.createdBy === userEmail
        );

        setUsers(filteredUsers);
      } catch (error) {
        setError(error.message || "Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userEmail]);

  // Handle credit input change
  const handleCreditChange = (email, value) => {
    setCreditUpdates((prev) => ({
      ...prev,
      [email]: value,
    }));
  };

  // Handle credit update
  const updateCredits = async (email, existingCredits) => {
    const additionalCredits = parseInt(creditUpdates[email], 10) || 0; // Get input value and convert to number
    const updatedCredits = existingCredits + additionalCredits; // Add new credits

    try {
      const response = await fetch(
        "http://localhost:3000/users/update-credits",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEmail: email,
            credits: updatedCredits, // Send updated total credits
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update credits.");
      }

      alert(`Credits updated successfully. New total: ${updatedCredits}`);

      // Update local state to reflect the new credits in UI
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userEmail === email ? { ...user, credits: updatedCredits } : user
        )
      );

      // Clear input field after update
      setCreditUpdates((prev) => ({
        ...prev,
        [email]: "",
      }));
    } catch (error) {
      console.error("Error updating credits:", error);
      alert(error.message);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar userEmail={userEmail} />
      <div className="main-content">
        <h1 className="user-list-header">User List</h1>

        {loading ? (
          <p>Loading users...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Email</th>
                {/* <th>Password</th> */}
                <th>Credits</th>
                <th>Update Credits</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.userEmail}>
                  <td>{index + 1}</td>
                  <td>{user.userEmail}</td>
                  {/* <td>{user.userPassword}</td> */}
                  {/* Not secure to display password */}
                  <td>{user.credits}</td>
                  <td>
                    <input
                      type="number"
                      placeholder="Enter credits"
                      value={creditUpdates[user.userEmail] || ""}
                      onChange={(e) =>
                        handleCreditChange(user.userEmail, e.target.value)
                      }
                    />
                    <button
                      onClick={() =>
                        updateCredits(user.userEmail, user.credits)
                      }
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserList;
