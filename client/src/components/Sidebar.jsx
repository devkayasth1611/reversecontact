import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/ProfileLookup.css";

const Sidebar = ({ userEmail }) => {
  const location = useLocation(); // Get the current location

  const menuItems = [
    { name: "Profile Lookup", path: "/profile-lookup" },
    { name: "Bulk Lookup", path: "/bulk-lookup" },
    { name: "API Access", path: "/api-access" },
    { name: "API Documentation", path: "/api-documentation" },
    { name: "Plans & Pricing", path: "/plans-pricing" },
    { name: "Sign out" },
  ];

  const handleMenuClick = (menuItem) => {
    if (menuItem === "Sign out") {
      localStorage.removeItem("user");
      window.location.href = "/login";
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
        <p>{userEmail}</p>
      </div>
      <nav className="menu">
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.name}
              onClick={() => handleMenuClick(item.name)}
              className={
                item.path === location.pathname ? "menu-item active" : "menu-item"
              }
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
          Upgrade your plan to unlock additional features and access more
          credits.
        </p>
        <button>Upgrade</button>
      </div>
    </aside>
  );
};

export default Sidebar;
