import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import NavbarD from "./NavbarD";
import { FaPlus, FaEllipsisV } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const Report = () => {
  const [selectedTab, setSelectedTab] = useState("ongoing");
  const [reports, setReports] = useState([]); // Changed to handle multiple reports
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const { user } = useAuth();

  const fetchReports = async () => {
    try {
      let response;

      // Determine the API endpoint based on the user's role
      if (user.role === "Admin") {
        response = await axios.post(
          "/api/reports/getCompanyReport",
          {
            user, // Send user data in the request body
          },
          {
            withCredentials: true, // Ensure cookies are sent
          }
        );
      } else if (user.role === "FacAdmin") {
        response = await axios.post(
          "/api/reports/get",
          {
            user, // Send user data in the request body
          },
          {
            withCredentials: true, // Ensure cookies are sent with the request
          }
        );
      } else {
        throw new Error("Invalid role");
      }

      // Handle "zero" response properly
      if (response.data.data === "zero") {
        setReports([]); // No reports available
      } else {
        setReports(response.data.data); // Set reports as an array or object based on response
        console.log("ReportComponent", response.data.data);
      }
    } catch (err) {
      setError("No reports available");
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const formatTimePeriod = (timePeriod) => {
    if (!timePeriod || typeof timePeriod !== "object") {
      return "Invalid time period";
    }

    const { type, start, end } = timePeriod;

    switch (type) {
      case "monthly":
        return new Date(start).toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
      case "quarterly":
        const quarter = Math.floor(new Date(start).getMonth() / 3) + 1;
        return `Q${quarter} ${new Date(start).getFullYear()}`;
      case "yearly":
        return new Date(start).getFullYear().toString();
      case "custom":
        return `${new Date(start).toLocaleDateString()} - ${new Date(
          end
        ).toLocaleDateString()}`;
      default:
        return "Invalid time period";
    }
  };

  const toggleDropdown = (reportId) => {
    setOpenDropdown(openDropdown === reportId ? null : reportId);
  };

  const handleMarkAsComplete = (reportId) => {
    console.log(`Marked report ${reportId} as complete`);
    setOpenDropdown(null);
  };

  const handleInProgress = (reportId) => {
    console.log(`Marked report ${reportId} as in-progress`);
    setOpenDropdown(null);
  };

  const renderReportCard = (report) => {
    if (!report) {
      return <p>No report available</p>;
    }

    return (
      <div className="bg-white shadow-md rounded-lg p-6 mb-4 relative">
        <h2 className="text-xl font-bold mb-2">{report.reportName}</h2>
        <p>
          <strong>Company Name:</strong> {report.companyName}
        </p>
        <p>
          <strong>Facility Name:</strong> {report.facilityName}
        </p>
        <p>
          <strong>Report ID:</strong> {report.reportId}
        </p>
        <p>
          <strong>Username:</strong> {report.username}
        </p>
        <p>
          <strong>Time Period:</strong> {formatTimePeriod(report.timePeriod)}
        </p>
        {/* Continue Button */}
        <Link
          to={{
            pathname: `/report/${report.reportId}/view`,
          }}
          className="absolute top-6 right-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Continue
        </Link>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarD />
      <div className="flex flex-1">
        <div className="w-1/6 sticky top-0 h-screen">
          <Sidebar />
        </div>
        <div className="flex-1 p-8 overflow-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <button
                className={`mr-4 ${
                  selectedTab === "ongoing" ? "font-bold" : ""
                }`}
                onClick={() => setSelectedTab("ongoing")}
              >
                Ongoing Reports
              </button>
              <button
                className={selectedTab === "history" ? "font-bold" : ""}
                onClick={() => setSelectedTab("history")}
              >
                Report History
              </button>
            </div>
            {/* Conditionally render the "Create New Report" button */}
            {error === "No reports available" && (
              <Link
                to="/newreport"
                className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
              >
                <FaPlus className="mr-2" /> Create New Report
              </Link>
            )}
          </div>
          {loading ? (
            <p>Loading reports...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : reports.length === 0 ? ( // No reports available
            <p className="mt-4">No reports made</p>
          ) : Array.isArray(reports) ? ( // Admin case: `reports` is an array
            reports.map((report, index) => (
              <div key={index}>{renderReportCard(report)}</div>
            ))
          ) : (
            // FacAdmin case: `reports` is an object
            renderReportCard(reports)
          )}
        </div>
      </div>
    </div>
  );
};

export default Report;
