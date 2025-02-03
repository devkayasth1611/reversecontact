import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import Sidebar from "../components/Sidebar";
import "../css/ProfileLookup.css";

const BulkLookup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [bulkResults, setBulkResults] = useState([]);
  const [file, setFile] = useState(null);

  const user = JSON.parse(sessionStorage.getItem("user"));
  const userEmail = user?.email || "Guest";
  const [statistics, setStatistics] = useState(() => {
    const allStats = JSON.parse(sessionStorage.getItem("statisticsData")) || {};
    return allStats[userEmail] || {
      duplicateCount: 0,
      netNewCount: 0,
      newEnrichedCount: 0,
      creditUsed: 0,
      remainingCredits:2000,
      uploadedLinks: [],
    };
  });

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    }
  }, []);

  // Fetch user credits from the database
  const fetchUserCredits = async () => {
    try {
      const response = await fetch(`http://localhost:3000/users/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch lookup credits");

      const data = await response.json();
      const currentUser = data.data.find((u) => u.userEmail === userEmail);

      if (currentUser) {
        setStatistics((prevState) => ({
          ...prevState,
          remainingCredits: currentUser.credits,
        }));
      }
    } catch (error) {
      console.error("Error fetching user credits:", error);
    }
  };

  // Function to update user credits in the backend
  const updateUserCredits = async (newCredits) => {
    try {
      await fetch(`http://localhost:3000/users/update-credits`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ userEmail, credits: newCredits }),
      });
    } catch (error) {
      console.error("Error updating user credits:", error);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please upload a file first.");
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileData = e.target.result;
        let links = [];

        if (file.name.endsWith(".csv")) {
          const parsedData = Papa.parse(fileData, { header: false }).data;
          links = parsedData.flat();
        } else if (file.name.endsWith(".xlsx")) {
          const workbook = XLSX.read(fileData, { type: "binary" });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
          links = jsonData.flat();
        }

        const linkedinRegex = /([a-z]{2,3}\.)?linkedin\.com\/.+$/;
        const validLinks = links.filter((link) => linkedinRegex.test(link));

        if (validLinks.length === 0) {
          alert("No valid LinkedIn links found in the file.");
          return;
        }

        setIsLoading(true);

        try {
          const apiUrl = `http://localhost:3000/mobileEnrichments/mobileEnrichment?linkedin_url=${validLinks.join(
            ","
          )}`;
          const response = await fetch(apiUrl);

          if (!response.ok) throw new Error("Failed to fetch bulk data");

          const data = await response.json();

          if (data.data && data.data.length > 0) {
            const bulkData = validLinks.map((link, index) => {
              const result = data.data[index];
              return {
                linkedin_url: link,
                full_name: result?.full_name || "Not Available",
                lead_location: Array.isArray(result?.lead_location)
                  ? result.lead_location.join(", ")
                  : result?.lead_location || "Not Available",
                mobile_1: result?.mobile_1 || "Not Available",
                mobile_2: result?.mobile_2 || "Not Available",
              };
            });

            setBulkResults(bulkData);

            // Save statistics AFTER bulk data is fetched
            await saveStatistics(file.name, validLinks);

            const newCredits = statistics.remainingCredits - 25; // Deduct 25 credits for file upload
            await updateUserCredits(newCredits);

            alert("Bulk data fetched successfully and statistics saved!");
          } else {
            alert("No data found for the provided LinkedIn URLs.");
          }
        } catch (error) {
          console.error("Error fetching bulk data:", error);
          alert("Error fetching bulk data. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      };

      if (file.name.endsWith(".csv")) {
        reader.readAsText(file);
      } else if (file.name.endsWith(".xlsx")) {
        reader.readAsBinaryString(file);
      }
    } catch (error) {
      console.error("Error processing file:", error);
      alert("Error processing file. Please try again later.");
    }
  };

  const saveStatistics = async (filename, validLinks) => {
    let userStats = JSON.parse(sessionStorage.getItem("statisticsData")) || {};
    let userPreviousUploads = userStats[userEmail]?.uploadedLinks || [];

    const newLinks = validLinks.filter((link) => !userPreviousUploads.includes(link));
    const duplicateLinks = validLinks.filter((link) => userPreviousUploads.includes(link));

    const duplicateCount = statistics.duplicateCount + duplicateLinks.length;
    const netNewCount = statistics.netNewCount + newLinks.length;

    const creditUsed = statistics.creditUsed + 25; // Deduct 25 credits per file upload
    const remainingCredits = Math.max(0, statistics.remainingCredits - 25);

    const updatedStatistics = {
      email: userEmail,
      filename,
      duplicateCount,
      netNewCount,
      newEnrichedCount: statistics.newEnrichedCount,
      creditUsed,
      remainingCredits,
      uploadedLinks: [...userPreviousUploads, ...newLinks],
    };

    userStats[userEmail] = updatedStatistics;
    sessionStorage.setItem("statisticsData", JSON.stringify(userStats));

    setStatistics(updatedStatistics);

    try {
      const response = await fetch("http://localhost:3000/bulkUpload/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedStatistics),
      });

      if (!response.ok) throw new Error(`Error saving statistics: ${response.statusText}`);
      alert("Statistics saved successfully!");
    } catch (error) {
      console.error("Error saving statistics:", error);
      alert(`Error saving statistics: ${error.message}`);
    }
  };

  const handleDownloadExcel = () => {
    if (bulkResults.length === 0) {
      alert("No bulk data available to download.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(bulkResults);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bulk Data Results");

    XLSX.writeFile(workbook, "Bulk_Data_Results.xlsx");
  };

  return (
    <div className="dashboard">
      <Sidebar userEmail={userEmail} />

      <div className="main-content">
        <div className="header">
          <h1 className="profile-lookup">Bulk Lookup</h1>
        </div>

        <div className="explore-section">
          <div className="file-upload-container">
            <label htmlFor="file-input" className="upload-label">
              Choose File
            </label>
            {file && <span className="file-name">{file.name}</span>}
            <input type="file" id="file-input" accept=".csv,.xlsx" onChange={(e) => setFile(e.target.files[0])} />
            <button className="upload-button" onClick={handleFileUpload}>
              {isLoading ? "Uploading..." : "Upload & Fetch"}
            </button>
            {bulkResults.length > 0 && (
              <button className="download-button" onClick={handleDownloadExcel}>
                Download Excel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkLookup;
