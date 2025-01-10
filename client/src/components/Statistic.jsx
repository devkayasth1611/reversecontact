import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar"; // Import Sidebar
import "../css/ProfileLookup.css";

const Statistic = () => {
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Retrieve email from localStorage
  const userEmail = JSON.parse(localStorage.getItem("user"))?.email || "Guest";

  // Redirect to login if user is not authenticated
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/bulkUpload/statistics"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch statistics");
        }

        const data = await response.json();
        setStatistics(Array.isArray(data) ? data : []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <div className="dashboard">
      {/* Sidebar Component */}
      <Sidebar userEmail={userEmail} />

      {/* Main Content */}
      <div className="main-content">
        {/* Header Section */}
        <div className="header">
          <h1 className="profile-lookup">Bulk Upload Statistics</h1>
        </div>
        <div className="statistics-page">
          {loading ? (
            <p>Loading statistics...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Sr No.</th>
                  <th>Date</th>
                  <th>Filename</th>
                  <th>Duplicate Count</th>
                  <th>Net New Count</th>
                  <th>New Enriched Count</th>
                  <th>Credit Used</th>
                  <th>Remaining Credits</th>
                </tr>
              </thead>
              <tbody>
                {statistics.length > 0 ? (
                  statistics.map((stat, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td> {/* Auto-increment Sr No */}
                      <td>{new Date(stat.date).toLocaleDateString()}</td>
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
                    <td colSpan="8">No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Statistic;