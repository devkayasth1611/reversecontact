import React from "react";
import Sidebar from "../components/Sidebar"; // Import Sidebar

const AdminCreditReport = () => {
  const userEmail =
    JSON.parse(sessionStorage.getItem("user"))?.email || "Guest";

  return (
    <div className="dashboard">
      {/* Sidebar Component */}
      <Sidebar userEmail={userEmail} />
      <h3>Admin Credit Report</h3>
    </div>
  );
};

export default AdminCreditReport;
