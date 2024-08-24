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
  const [report, setReport] = useState({}); // Change to a single report object
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const { user } = useAuth();

  const fetchReports = async () => {
    try {
      let response;

      // Determine the API endpoint based on the user's role
      if (user.role === "Admin") {
        response = await axios.get("/api/reports/getCompanyReport");
      } else if (user.role === "FacAdmin") {
        response = await axios.get("/api/reports/get");
      } else {
        throw new Error("Invalid role");
      }

      // Handle "zero" response properly
      if (response.data.data === "zero") {
        setReport(null);
      } else {
        setReport(response.data.data); // Set report directly as an object
        console.log("ReportComponent", response.data.data);
      }
    } catch (err) {
      setError("Failed to fetch reports");
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
        {/* <div className="relative inline-block text-left mt-4">
          <button
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
            id={`options-menu-${report.reportId}`}
            aria-haspopup="true"
            aria-expanded="true"
            onClick={() => toggleDropdown(report.reportId)}
          >
            <FaEllipsisV />
          </button>
          {openDropdown === report.reportId && (
            <div
              className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby={`options-menu-${report.reportId}`}
            >
              <div className="py-1" role="none">
                <Link
                  to={`/report/${report.reportId}/edit`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                >
                  View
                </Link>
                <button
                  onClick={() => handleMarkAsComplete(report.reportId)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                >
                  Mark as Complete
                </button>
                <button
                  onClick={() => handleInProgress(report.reportId)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                >
                  In-Progress
                </button>
              </div>
            </div>
          )}
        </div> */}

        {/* Continue Button */}
        <Link
          to={{
            pathname: `/report/${report.reportId}/view`,
            // state: { report },
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
            {/* <Link
              to="/newreport"
              className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
            >
              <FaPlus className="mr-2" /> Create New Report
            </Link> */}
          </div>
          {loading ? (
            <p>Loading reports...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : !report ? (
            <p className="mt-4">No reports made</p>
          ) : (
            renderReportCard(report)
          )}
        </div>
      </div>
    </div>
  );
};

export default Report;
