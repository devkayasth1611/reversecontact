import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/ProfileLookup.css";

const ProfileLookup = () => {
  // State to track the active menu item
  const [activeMenu, setActiveMenu] = useState("Profile Lookup");

  // Menu items
  const menuItems = [
    { name: "Profile Lookup", path: "/profile-lookup" },
    { name: "Bulk Lookup", path: "/bulk-lookup" },
    { name: "API Access" },
    { name: "API Documentation" },
    { name: "Plans & Pricing" },
    { name: "Sign out" },
  ];

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [linkedinLink, setLinkedinLink] = useState("");
  const [resultData, setResultData] = useState(null);

  const handleSearch = async () => {
    const linkedinRegex = /([a-z]{2,3}\.)?linkedin\.com\/.+$/;

    if (!linkedinRegex.test(linkedinLink)) {
      alert("Invalid LinkedIn link. Please try again.");
      return;
    }

    try {
      setIsLoading(true);

      const apiUrl = `http://localhost:3000/mobileEnrichments/mobileEnrichment/single/${encodeURIComponent(
        linkedinLink
      )}`;

      const response = await fetch(apiUrl);

      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();

      if (data.data) {
        setResultData(data.data);
        setShowModal(true);
      } else {
        alert("No data found for the provided LinkedIn URL.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="user-info">
          <div className="avatar-container">
            <img
              src="https://via.placeholder.com/100"
              alt="Profile"
              className="avatar"
            />
          </div>
          <p>devkayasth.edunet@gmail.com</p>
        </div>
        <nav className="menu">
          <ul>
            {menuItems.map((item) => (
              <li
                key={item.name}
                className={activeMenu === item.name ? "active" : ""}
                onClick={() => setActiveMenu(item.name)}
              >
                {/* Wrap the entire li area in the Link component */}
                <Link to={item.path} className="menu-link">
                  {item.name}
                </Link>
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

      {/* Main Content */}
      <div className="main-content">
        {/* Header Section */}
        <div className="header">
          <h1 className="profile-lookup">Profile Lookup</h1>
          {/* <div className="credits">
            <div>
              Credits: <span>20</span>
            </div>
            <div>
              Daily Limit: <span>20</span>
            </div>
          </div> */}
        </div>

        {/* Explore Real-Time Data Section */}
        <div className="explore-section">
          {/* <h1>Explore Real-Time Data</h1>
          <p>
            Retrieve contact and company data in real time using our OSINT
            methods. Just provide the input and access the data you need
            instantly.
          </p> */}

          {/* Lookup Options */}
          {/* <div className="lookup-options">
            <div className="lookup-card">Email Lookup</div>
            <div className="lookup-card">Person Finder</div>
            <div className="lookup-card">Company Finder</div>
            <div className="lookup-card">LinkedIn URL</div>
            <div className="lookup-card new-feature">Activities Finder</div>
          </div> */}

          {/* Search Box */}
          <div className="search-box">
            <input
              type="url"
              placeholder="Enter a LinkedIn profile link"
              value={linkedinLink}
              onChange={(e) => setLinkedinLink(e.target.value)}
            />
            <button className="search-button" onClick={handleSearch}>
              {isLoading ? "Search" : "Search"}
            </button>
          </div>

          {showModal && resultData && (
            <div className="modal-overlay-1">
              <div className="modal-container-1">
                <button
                  className="close-button"
                  onClick={() => setShowModal(false)}
                >
                  &times;
                </button>
                <div className="modal-header-1">
                  <h2>LinkedIn Profile Data</h2>
                </div>
                <div className="modal-body-1">
                  <div className="info-row-1">
                    <strong>LinkedIn Link:</strong>
                    <a
                      href={resultData.linkedin_url}
                      target="_blank"
                      rel="noreferrer"
                      className="info-value-1"
                    >
                      {resultData.linkedin_url || "Not Available"}
                    </a>
                  </div>
                  <div className="info-row-1">
                    <strong>Full Name:</strong>
                    <span className="info-value-1">
                      {resultData.full_name || "N/A"}
                    </span>
                  </div>
                  <div className="info-row-1">
                    <strong>Lead Location:</strong>
                    <span className="info-value-1">
                      {Array.isArray(resultData.lead_location)
                        ? resultData.lead_location.join(", ")
                        : "Not Available"}
                    </span>
                  </div>
                  <div className="info-row-1">
                    <strong>Mobile 1:</strong>
                    <span className="info-value-1">
                      {resultData.mobile_1 || "Not Available"}
                    </span>
                  </div>
                  <div className="info-row-1">
                    <strong>Mobile 2:</strong>
                    <span className="info-value-1">
                      {resultData.mobile_2 || "Not Available"}
                    </span>
                  </div>
                </div>
                <div className="modal-footer-1">
                  <button
                    className="action-button-1"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileLookup;
