import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse"; // For CSV parsing
import * as XLSX from "xlsx"; // For Excel file parsing
import Sidebar from "../components/Sidebar"; // Import Sidebar
import "../css/ProfileLookup.css";

const BulkLookup = () => {
  const navigate = useNavigate(); // For redirecting to login after sign-out
  const [isLoading, setIsLoading] = useState(false);
  const [bulkResults, setBulkResults] = useState([]);
  const [file, setFile] = useState(null);

  // Retrieve email from localStorage
  const userEmail = JSON.parse(localStorage.getItem("user"))?.email || "Guest";

  // Redirect to login if user is not authenticated
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      window.location.href = "/login";
    }
  }, []);

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

        const apiUrl = `http://localhost:3000/mobileEnrichments/mobileEnrichment?linkedin_url=${validLinks.join(
          ","
        )}`;
        const response = await fetch(apiUrl);

        if (!response.ok) throw new Error("Failed to fetch bulk data");

        const data = await response.json();

        if (data.data && data.data.length > 0) {
          const bulkData = validLinks.map((link, index) => {
            const result = data.data[index];
            if (result) {
              return {
                linkedin_url: link,
                full_name: result.full_name || "Not Available",
                lead_location: result.lead_location || "Not Available",
                mobile_1: result.mobile_1 || "Not Available",
                mobile_2: result.mobile_2 || "Not Available",
              };
            } else {
              return {
                linkedin_url: link,
                full_name: "Not Available",
                lead_location: "Not Available",
                mobile_1: "Not Available",
                mobile_2: "Not Available",
              };
            }
          });

          setBulkResults(bulkData);
          alert("Bulk data fetched successfully!");
        } else {
          alert("No data found for the provided LinkedIn URLs.");
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
    } finally {
      setIsLoading(false);
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
      {/* Sidebar Component */}
      <Sidebar userEmail={userEmail} />

      {/* Main Content */}
      <div className="main-content">
        {/* Header Section */}
        <div className="header">
          <h1 className="profile-lookup">Bulk Lookup</h1>
        </div>

        {/* Explore Real-Time Data Section */}
        <div className="explore-section">
          <div className="file-upload-container">
            <label htmlFor="file-input" className="upload-label">
              Choose File
            </label>
            {file && <span className="file-name">{file.name}</span>}
            <input
              type="file"
              id="file-input"
              accept=".csv,.xlsx"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <button className="upload-button" onClick={handleFileUpload}>
              {isLoading ? "Upload" : "Upload & Fetch"}
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
