import React from "react";
import Sidebar from "../components/Sidebar"; // Import Sidebar

const UserCreditReport = () => {
  const userEmail =
    JSON.parse(sessionStorage.getItem("user"))?.email || "Guest";

  return (
    <div className="dashboard">
      {/* Sidebar Component */}
      <Sidebar userEmail={userEmail} />
      <h3> User Credit Report </h3>
    </div>
  );
};

export default UserCreditReport;
