import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import NavbarD from "./NavbarD";
import { FaPlus, FaEllipsisV } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

const Report = () => {
  const [selectedTab, setSelectedTab] = useState("ongoing");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  const fetchReports = async () => {
    try {
      const response = await axios.get("/api/reports/get");
      if (response.data.data === "zero") {
        setReports([]);
      } else {
        console.log("ReportComponent", response.data.data);

        setReports(response.data.data);
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

  const handleDelete = async (reportId) => {
    try {
      await axios.delete(`/api/reports/${reportId}/delete`);
      toast.success("Report deleted successfully");
      fetchReports(); // Refresh the reports list
      setOpenDropdown(null);
    } catch (err) {
      toast.error("Failed to delete report");
      console.error("Error deleting report:", err);
    }
  };

  const toggleDropdown = (reportId) => {
    setOpenDropdown(openDropdown === reportId ? null : reportId);
  };

  const handleMarkAsComplete = (reportId) => {
    // Implement mark as complete logic
    console.log(`Marked report ${reportId} as complete`);
    setOpenDropdown(null);
  };

  const handleInProgress = (reportId) => {
    // Implement in-progress logic
    console.log(`Marked report ${reportId} as in-progress`);
    setOpenDropdown(null);
  };
  const renderTable = (reports) => (
    <div>
      <table className="w-full mt-4 border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Report Name</th>
            <th className="p-2 text-left">Username</th>
            <th className="p-2 text-left">Time Period</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.reportId} className="border-b">
              <td className="p-2">{report.reportName}</td>
              <td className="p-2">{report.username}</td>
              <td className="p-2">{formatTimePeriod(report.timePeriod)}</td>
              <td className="p-2">
                <div className="relative inline-block text-left">
                  <div>
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
                  </div>
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
                        <button
                          onClick={() => handleDelete(report.reportId)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          role="menuitem"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );

  return (
    <div className="flex flex-col h-screen">
      <NavbarD />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
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
            <Link
              to="/newreport"
              className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
            >
              <FaPlus className="mr-2" /> Create New Report
            </Link>
          </div>
          {loading ? (
            <p>Loading reports...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : reports.length === 0 ? (
            <p className="mt-4">No reports made</p>
          ) : (
            renderTable(reports)
          )}
        </div>
      </div>
    </div>
  );
};

export default Report;
