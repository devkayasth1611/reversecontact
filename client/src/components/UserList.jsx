import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../css/UserList.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creditUpdates, setCreditUpdates] = useState({});
  const [userCredits, setUserCredits] = useState(0); // Store logged-in user's credits

  const userEmail = JSON.parse(sessionStorage.getItem("user"))?.email || "Guest";

  useEffect(() => {
    fetchUsers();
    fetchUserCredits(); // Fetch credits for logged-in user
  }, [userEmail]);

  // Fetch user list (Filtered by createdBy)
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3000/users/user");
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const { data } = await response.json();
      const filteredUsers = data.filter((user) => user.createdBy === userEmail);
      setUsers(filteredUsers);
    } catch (error) {
      setError(error.message || "Failed to fetch user data.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch credits for the logged-in user
  const fetchUserCredits = async () => {
    try {
      const response = await fetch("http://localhost:3000/users/getAllAdmin");
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const { data } = await response.json();
      const loggedInUser = data.find((user) => user.userEmail === userEmail);

      if (loggedInUser) {
        setUserCredits(loggedInUser.credits || 0); // Set user's credits
      }
    } catch (error) {
      console.error("Error fetching user credits:", error);
    }
  };

  // Handle credit input change
  const handleCreditChange = (email, value) => {
    setCreditUpdates((prev) => ({
      ...prev,
      [email]: value,
    }));
  };

  // Handle Add Credits (Reduce from logged-in user, add to selected user)
const handleAddCredits = async (email, existingCredits) => {
  const transferCredits = parseInt(creditUpdates[email], 10) || 0;

  if (transferCredits > userCredits) {
    alert("Not enough credits to transfer.");
    return;
  }

  const updatedLoggedInCredits = userCredits - transferCredits;
  const updatedUserCredits = existingCredits + transferCredits;

  await updateCredits(email, updatedUserCredits, updatedLoggedInCredits, true); // true for adding credits
};

// Handle Minus Credits (Increase logged-in user, reduce from selected user)
const handleMinusCredits = async (email, existingCredits) => {
  const transferCredits = parseInt(creditUpdates[email], 10) || 0;

  if (transferCredits > existingCredits) {
    alert("User does not have enough credits to transfer.");
    return;
  }

  const updatedLoggedInCredits = userCredits + transferCredits;
  const updatedUserCredits = existingCredits - transferCredits;

  await updateCredits(email, updatedUserCredits, updatedLoggedInCredits, false); // false for deducting credits
};


  // Update Credits in Database
  const updateCredits = async (email, updatedUserCredits, updatedLoggedInCredits, isAdding) => {
    const transferCredits = parseInt(creditUpdates[email], 10) || 0;
  
    if (transferCredits === 0) {
      alert("Enter a valid amount to transfer.");
      return;
    }
  
    // Determine transaction type correctly
    const senderTransactionType = isAdding ? "debit" : "credit"; // Logged-in user is sending (reduce for add, increase for minus)
    const recipientTransactionType = isAdding ? "credit" : "debit"; // Recipient is receiving (increase for add, reduce for minus)
  
    try {
      // Update recipient user's credits
      await fetch("http://localhost:3000/transactions/update-credits", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: email, // Recipient user
          updatedCredits: updatedUserCredits,
          transactionType: recipientTransactionType,
          amount: Math.abs(transferCredits),
        }),
      });
  
      // Update logged-in user's credits
      await fetch("http://localhost:3000/transactions/update-credits", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail, // Logged-in user
          updatedCredits: updatedLoggedInCredits,
          transactionType: senderTransactionType,
          amount: Math.abs(transferCredits),
        }),
      });
  
      alert(`Transaction successful! Your new credits: ${updatedLoggedInCredits}`);
  
      // Update UI
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userEmail === email ? { ...user, credits: updatedUserCredits } : user
        )
      );
  
      setUserCredits(updatedLoggedInCredits);
      setCreditUpdates((prev) => ({ ...prev, [email]: "" }));
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

        {/* Display logged-in user's credits */}
        <h3>My Credits: {userCredits}</h3>

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
                <th>Sr No</th>
                <th>Email</th>
                <th>Credits</th>
                <th>Transfer Credits</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.userEmail}>
                  <td>{index + 1}</td>
                  <td>{user.userEmail}</td>
                  <td>{user.credits}</td>
                  <td>
                    <input
                      type="number"
                      placeholder="Enter credits"
                      value={creditUpdates[user.userEmail] || ""}
                      onChange={(e) => handleCreditChange(user.userEmail, e.target.value)}
                    />
                  </td>
                  <td>
                    <button className="add-btn" onClick={() => handleAddCredits(user.userEmail, user.credits)}>
                      +
                    </button> 
                    <button className="minus-btn" onClick={() => handleMinusCredits(user.userEmail, user.credits)}>
                      -
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
