import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar"; // Import Sidebar
import "../css/ProfileLookup.css"; // Add custom styles

const UserStatistics = () => {
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(false);

  // Retrieve the logged-in user's email
  const userEmail = JSON.parse(sessionStorage.getItem("user"))?.email || "Guest";

  // Redirect to login if the user is not authenticated
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    const fetchUserStatistics = async () => {
      if (!userEmail || userEmail === "Guest") return; // Exit if no user email

      setLoading(true);

      try {
        // Fetch statistics from the API
        const response = await fetch(
          `http://localhost:3000/bulkUpload/userStatistics?email=${userEmail}`
        );

        if (!response.ok) throw new Error("Failed to fetch statistics");

        const data = await response.json();

        if (data.length === 0) {
          setStatistics([]); // Ensure statistics is an empty array
        } else {
          setStatistics(data);
        }
      } catch (err) {
        console.error("Error fetching statistics:", err); // Log the error but don't show in UI
      } finally {
        setLoading(false);
      }
    };

    fetchUserStatistics();
  }, [userEmail]);

  return (
    <div className="dashboard">
      {/* Sidebar Component */}
      <Sidebar userEmail={userEmail} />

      {/* Main Content */}
      <div className="main-content">
        {/* Header Section */}
        <div className="header">
          <h1 className="profile-lookup">User Statistics</h1>
        </div>

        <div className="statistics-page">
          {loading ? (
            <p>Loading statistics...</p>
          ) : (
            <>
              <table>
                <thead>
                  <tr>
                    <th>File Name / LinkedIn Link</th>
                    <th>Duplicate Count</th>
                    <th>Net New Count</th>
                    <th>New Enriched Count</th>
                    <th>Credits Used</th>
                    <th>Remaining Credits</th>
                  </tr>
                </thead>
                <tbody>
                  {statistics.length > 0 ? (
                    statistics.map((stat, index) => (
                      <tr key={index}>
                        <td>{stat.filename}</td>
                        <td>{stat.duplicateCount}</td>
                        <td>{stat.netNewCount}</td>
                        <td>{stat.newEnrichedCount}</td>
                        <td>{stat.creditUsed}</td>
                        <td>{stat.remainingCredits}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", color: "gray" }}>
                        No statistics available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserStatistics;
