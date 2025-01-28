import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../css/ProfileLookup.css";

const Sidebar = () => {
  const [userEmail, setUserEmail] = useState(null); // State to store user email
  const location = useLocation(); 
  const navigate = useNavigate(); // Import useNavigate for navigation
  const roleId = localStorage.getItem("roleId"); // Fetch roleId from localStorage

  // useEffect hook to fetch user data from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("Fetched user:", user); // Debugging line
    
    if (user && user.email) {
      setUserEmail(user.email); // Set user email if available
    } else {
      setUserEmail("Guest"); // Fallback value if no email found
      console.log("User data not found or incomplete.");
    }
  }, []);

  // Define menu items for both roles
  const adminMenuItems = [
    { name: "Statistic", path: "/statistic" },
    { name: "Add User", path: "/add-user" },
    { name: "User List", path: "/user-list" },
    { name: "Sign out" },
  ];

  const userMenuItems = [
    { name: "Profile Lookup", path: "/profile-lookup" },
    { name: "Bulk Lookup", path: "/bulk-lookup" },
    { name: "User Statistic", path: "/UserStatistics" },
    // { name: "API Documentation" },
    // { name: "Plans & Pricing" },
    { name: "Sign out" },
  ];

  // Choose menu items based on roleId
  const menuItems = roleId === "1" ? adminMenuItems : userMenuItems;

  const handleMenuClick = (menuItem) => {
    if (menuItem === "Sign out") {
      localStorage.removeItem("user");
      localStorage.removeItem("roleId"); // Clear roleId on logout
      navigate("/login"); // Use navigate to redirect to login
    }
  };

  return (
    <aside className="sidebar">
      <div className="user-info">
        <div className="avatar-container">
          <img
            src="https://via.placeholder.com/100"
            alt="Profile"
            className="avatar"
          />
        </div>
        {/* Display the user email */}
        <p>{userEmail ? userEmail : "Loading..."}</p>
      </div>
      <nav className="menu">
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.name}
              onClick={() => handleMenuClick(item.name)}
              className={item.path === location.pathname ? "menu-item active" : "menu-item"}
            >
              {item.path ? (
                <Link to={item.path} className="menu-link">
                  {item.name}
                </Link>
              ) : (
                <span className="menu-link">{item.name}</span>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="start-plan">
        <h3>Start Your Plan</h3>
        <p>
          Upgrade your plan to unlock additional features and access more credits.
        </p>
        <button>Upgrade</button>
      </div>
    </aside>
  );
};

export default Sidebar;