import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../css/AllUser.css'; // Import the external CSS file

const AllUser = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const loggedInUserEmail = JSON.parse(sessionStorage.getItem('user'))?.email || 'Guest';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/users/getAllUser');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Fetched Data:', result);

        if (Array.isArray(result.data)) {
          setUsers(result.data);
        } else {
          console.error('Unexpected API Response:', result);
          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Function to map roleId to role names
  const getRoleName = (roleId) => {
    switch (roleId) {
      case 1:
        return 'Admin';
      case 2:
        return 'User';
      case 3:
        return 'Super Admin';
      default:
        return 'Unknown';
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    const roleName = getRoleName(user.roleId).toLowerCase();
    const roleId = String(user.roleId);
    const email = user.userEmail?.toLowerCase() || '';
    const phone = user.phoneNumber?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();

    return (
      roleName.includes(search) ||
      roleId.includes(search) ||
      email.includes(search) ||
      phone.includes(search)
    );
  });

  return (
    <div className="dashboard">
      <Sidebar userEmail={loggedInUserEmail} />
      <div className="content-container">
        <h2>All Users</h2>

        {/* Search Input Field */}
        <input
          type="text"
          placeholder="Search by Role Name, Email, or Phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>User Email</th>
                <th>User Password</th>
                <th>Company Name</th>
                <th>Phone Number</th>
                <th>Role</th>
                <th>Created By</th>
                <th>Credits</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={index}>
                    <td>{user.userEmail || "N/A"}</td>
                    <td>{user.userPassword || "N/A"}</td>
                    <td>{user.companyName || "N/A"}</td>
                    <td>{user.phoneNumber || "N/A"}</td>
                    <td>{getRoleName(user.roleId)}</td>
                    <td>{user.createdBy || "N/A"}</td>
                    <td>{user.credits || "N/A"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllUser;
