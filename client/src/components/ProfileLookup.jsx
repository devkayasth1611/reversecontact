import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../css/ProfileLookup.css";

const ProfileLookup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [linkedinLink, setLinkedinLink] = useState("");
  const [resultData, setResultData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const userEmail = JSON.parse(localStorage.getItem("user"))?.email || "Guest";

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      window.location.href = "/login";
    }
  }, []);

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
      <Sidebar userEmail={userEmail} />

      <div className="main-content">
        <div className="header">
          <h1 className="profile-lookup">Profile Lookup</h1>
        </div>

        <div className="explore-section">
          <div className="search-box">
            <input
              type="url"
              placeholder="Enter a LinkedIn profile link"
              value={linkedinLink}
              onChange={(e) => setLinkedinLink(e.target.value)}
            />
            <button className="search-button" onClick={handleSearch}>
              {isLoading ? "Searching..." : "Search"}
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
