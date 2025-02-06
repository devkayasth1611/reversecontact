import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Index from "./components";
import Header from "./components/header";
import Footer from "./components/footer";
import MobileEnrichment from "./components/MobileEnrichment";
import LinkedinContactVerification from "./components/LinkedinContactVerification";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ProfileLookup from "./components/ProfileLookup";
import BulkLookup from "./components/BulkLookup";
import AddUser from "./components/AddUser";
import Statistic from "./components/Statistic";
import UserList from "./components/userList";
import UserStatistics from "./components/UserStatistics";
import AllUser from "./components/AllUser";
import AllStatistics from "./components/AllStatistics";

import "./App.css";

function App() {
  const location = useLocation();
  const excludePaths = [
    "/login",
    "/signup",
    "/profile-lookup",
    "/bulk-lookup",
    "/statistic",
    "/add-user",
    "/user-list",
    "/UserStatistics",
    "/all-user",
    "/all-user-statistics",
  ]; // Paths without Header/Footer

  const isExcluded = excludePaths.includes(location.pathname); // Check if current path matches

  return (
    <>
      {!isExcluded && <Header />} {/* Show Header if path is not excluded */}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/profile-lookup" element={<ProfileLookup />} />
        <Route path="/bulk-lookup" element={<BulkLookup />} />
        <Route path="/statistic" element={<Statistic />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/add-user" element={<AddUser />} />
        <Route path="/user-list" element={<UserList />} />
        <Route path="/all-user" element={<AllUser />} />
        <Route path="/all-user-statistics" element={<AllStatistics />} />
        <Route path="/UserStatistics" element={<UserStatistics />} />
        <Route path="/mobile-enrichment" element={<MobileEnrichment />} />
        <Route path="/linkedin-contact-verification" element={<LinkedinContactVerification />} />
      </Routes>
      {!isExcluded && <Footer />} {/* Show Footer if path is not excluded */}
    </>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
