import React, { useState } from "react";
import { Link } from "react-router-dom";
import Papa from "papaparse"; // For CSV parsing
import * as XLSX from "xlsx"; // For Excel file parsing
import "../css/ProfileLookup.css";

const BulkLookup = () => {
  // State to track the active menu item
  const [activeMenu, setActiveMenu] = useState("Bulk Lookup");

  // Menu items
  const menuItems = [
    { name: "Profile Lookup", path: "/profile-lookup" },
    { name: "Bulk Lookup", path: "/bulk-lookup" },
    { name: "API Access" },
    { name: "API Documentation" },
    { name: "Plans & Pricing" },
    { name: "Sign out" },
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [bulkResults, setBulkResults] = useState([]);
  const [file, setFile] = useState(null);
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
          <h1 className="profile-lookup">Bulk Lookup</h1>
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
          {/* <h1>Explore Real-Time Data</h1> */}
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
