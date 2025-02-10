import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../css/Statistic.css";

const Statistics = () => {
  const [statistics, setStatistics] = useState([]);
  const [userEmails, setUserEmails] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loggedInUserEmail =
    JSON.parse(sessionStorage.getItem("user"))?.email || "Guest";

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const response = await fetch("http://localhost:3000/users/user");
        if (!response.ok) throw new Error("Failed to fetch users");

        const { data } = await response.json();
        const filteredUsers = data.filter(
          (user) => user.createdBy === loggedInUserEmail
        );
        const emails = filteredUsers.map((user) => user.userEmail); // Extract emails

        setUserEmails(emails);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserList();
  }, [loggedInUserEmail]);

  useEffect(() => {
    if (userEmails.length === 0) return;

    const fetchStatistics = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/bulkUpload/allstatistics"
        );
        if (!response.ok) throw new Error("Failed to fetch statistics");

        const data = await response.json();
        const filteredStatistics = data.filter((stat) =>
          userEmails.includes(stat.email)
        );

        setStatistics(filteredStatistics);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [userEmails]);

  return (
    <div className="dashboard">
      <Sidebar userEmail={loggedInUserEmail} />
      <div className="main-content">
        <h1 className="profile-lookup">All User Statistics</h1>
        {loading ? (
          <p>Loading statistics...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : statistics.length > 0 ? (
          <div className="table-container">
            <table className="statistics-table">
              <thead>
                <tr>
                  <th>Sr No.</th>
                  <th>Task</th>
                  <th>Email</th>
                  <th>File Name / LinkedIn Link</th>
                  <th>Link Upload</th>
                  <th>Duplicate Count</th>
                  <th>Net New Count</th>
                  <th>New Enriched Count</th>
                  <th>Credits Used</th>
                  <th>Remaining Credits</th>
                </tr>
              </thead>
              <tbody>
                {statistics.map((stat, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{stat.task}</td>
                    <td>{stat.email}</td>
                    <td>{stat.filename}</td>
                    <td>{stat.linkUpload}</td>
                    <td>{stat.duplicateCount}</td>
                    <td>{stat.netNewCount}</td>
                    <td>{stat.newEnrichedCount}</td>
                    <td>{stat.creditUsed}</td>
                    <td>{stat.remainingCredits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No statistics available.</p>
        )}
      </div>
    </div>
  );
};

export default Statistics;
