import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../css/AllUser.css'; // Import the external CSS file

const AllAdmin = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const loggedInUserEmail = JSON.parse(sessionStorage.getItem('user'))?.email || 'Guest';

  useEffect(() => {
    fetchUsersWithCredits();
  }, []);

  const fetchUsersWithCredits = async () => {
    try {
      const adminResponse = await fetch('http://localhost:3000/users/getAllAdmin');
      if (!adminResponse.ok) throw new Error(`Admin API error: ${adminResponse.status}`);
  
      const adminResult = await adminResponse.json();
      if (!Array.isArray(adminResult.data)) {
        console.error('Unexpected API Response:', adminResult);
        return;
      }
  
      // Directly set users since getAllAdmin already includes credits
      const updatedUsers = adminResult.data.map(user => ({
        ...user,
        credits: user.credits || 0,  // Ensure credits are set, default to 0
        newCredits: '' // Empty input for adding credits
      }));
  
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  

  const handleUpdateCredits = async (userEmail, newCredits) => {
    if (newCredits === '') {
      alert("Please enter credits");
      return;
    }
  
    const user = users.find(user => user.userEmail === userEmail);
    if (!user) {
      alert("User not found");
      return;
    }
  
    const updatedCredits = Number(user.credits) + Number(newCredits); // Add new credits to existing ones
  
    try {
      const response = await fetch('http://localhost:3000/users/update-credits', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail, credits: updatedCredits }),
      });
  
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        fetchUsersWithCredits(); // Refresh user list after updating
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error updating credits:", error);
    }
  };
  

  const handleInputChange = (index, value) => {
    const updatedUsers = [...users];
    updatedUsers[index].newCredits = value;
    setUsers(updatedUsers);
  };

  return (
    <div className="dashboard">
      <Sidebar userEmail={loggedInUserEmail} />
      <div className="content-container">
        <h2>All Admins</h2>

        {/* Search Input Field */}
        <input
          type="text"
          placeholder="Search by Email or Phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>User Email</th>
                <th>Password</th>
                <th>Company Name</th>
                <th>Phone Number</th>
                <th>Credits</th>
                <th colSpan="2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={index}>
                    <td>{user.userEmail || "N/A"}</td>
                    <td>{user.userPassword || "N/A"}</td>
                    <td>{user.companyName || "N/A"}</td>
                    <td>{user.phoneNumber || "N/A"}</td>
                    <td>{user.credits || 0}</td>
                    <td>
                      <input
                        type="number"
                        value={user.newCredits}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        placeholder="Enter Credits"
                        className="credit-input"
                      />
                    </td>
                    <td>
                      <button onClick={() => handleUpdateCredits(user.userEmail, user.newCredits)}>Update</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No admins found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllAdmin;
