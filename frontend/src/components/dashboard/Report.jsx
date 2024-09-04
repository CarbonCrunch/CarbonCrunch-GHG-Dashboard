import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import NavbarD from "./NavbarD";
import { FaPlus } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const Report = () => {
  const [selectedTab, setSelectedTab] = useState("ongoing");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  // console.log("User:", user);
 const fetchReports = async () => {
   try {
     let response;

     if (user.role === "Admin") {
       response = await axios.post(
         "/api/reports/getCompanyReport",
         {
           user,
         },
         {
           withCredentials: true,
         }
       );
     } else if (user.role === "FacAdmin") {
       response = await axios.post(
         "/api/reports/get",
         {
           user,
         },
         {
           withCredentials: true,
         }
       );
     } else {
       throw new Error("Invalid role");
     }

     if (response.data.data === "zero") {
       setReports([]);
       setLoading(false);
       console.log("No reports found, setting reports to an empty array");
     } else {
       const fetchedData = response.data.data;

       // Ensure fetchedData is always an array
       const reportsArray = Array.isArray(fetchedData)
         ? fetchedData
         : [fetchedData];

       // Using functional update to ensure correct state setting
       setReports(() => {
        //  console.log("New reports state to be set:", reportsArray);
         return reportsArray;
       });
       setLoading(false);
     }
   } catch (err) {
     console.error("Error fetching reports:", err);
   }
 };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleAddData = async () => {
    try {
      const response = await axios.post(
        "/api/reports/addData",
        {
          facilityName: user.facilities[0].facilityName,
          companyName: user.companyName,
          username: user.username,
        },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`, // Include accessToken in headers
          },
          withCredentials: true, // Ensure cookies are sent
        }
      );

      toast.success("Now add data for your facility");
      navigate("/datainboard");
    } catch (error) {
      toast.error("Failed to create report. Please try again.");
      console.error("Error creating report:", error);
    }
  };

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

  // Determine if the facility names match
 const doesFacilityNameMatch = reports.some(
   (report) =>
     report.facilityName.toLowerCase() ===
     user.facilities[0].facilityName.toLowerCase()
 );


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

            <div className="flex space-x-2">
             
              {!doesFacilityNameMatch && (
                <button
                  onClick={handleAddData}
                  className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
                >
                  <FaPlus className="mr-2" /> Add Data for Your Facility
                </button>
              )}
              <Link
                to="/newreport"
                className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
              >
                <FaPlus className="mr-2" /> Generate Report
              </Link>
            </div>
          </div>

          {loading ? (
            <p>Loading reports...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : reports.length === 0 ? (
            <p className="mt-4">No reports made</p>
          ) : Array.isArray(reports) ? (
            reports.map((report, index) => (
              <div key={index}>{renderReportCard(report)}</div>
            ))
          ) : (
            renderReportCard(reports)
          )}
        </div>
      </div>
    </div>
  );
};

export default Report;
