import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../css/UserList.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const filteredUsers = data.filter(user => user.createdBy === userEmail);
        
        setUsers(filteredUsers);
      } catch (error) {
        setError(error.message || "Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userEmail]);

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
                <th>Password</th>
                <th>Credits</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.userEmail}</td>
                  <td>{user.userPassword}</td> {/* Display password (not secure) */}
                  <td>{user.credits}</td>
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