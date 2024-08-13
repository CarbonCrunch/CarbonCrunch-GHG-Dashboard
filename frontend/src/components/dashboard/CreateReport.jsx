import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";
import NavbarD from "./NavbarD";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const CreateReport = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reportName, setReportName] = useState("");
  const [facilityName, setFacilityName] = useState("");
  const [timePeriodType, setTimePeriodType] = useState("");
  const [timeDetail, setTimeDetail] = useState("");

  // axios.defaults.baseURL = "http://127.0.0.1:8000";
  axios.defaults.baseURL = "https://139.59.56.80:8000";
  https: axios.defaults.withCredentials = true;

  useEffect(() => {
    if (user && user.facilityName) {
      setFacilityName(user.facilityName);
    }
  }, [user]);

  const formatTimePeriod = () => {
    const currentYear = new Date().getFullYear();
    switch (timePeriodType) {
      case "monthly":
        const [year, month] = timeDetail.split("-");
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0);
        return { type: "monthly", start, end };
      case "quarterly":
        const quarterMap = { Q1: 0, Q2: 3, Q3: 6, Q4: 9 };
        const quarterStart = new Date(currentYear, quarterMap[timeDetail], 1);
        const quarterEnd = new Date(currentYear, quarterMap[timeDetail] + 3, 0);
        return { type: "quarterly", start: quarterStart, end: quarterEnd };
      case "yearly":
        const yearStart = new Date(timeDetail, 0, 1);
        const yearEnd = new Date(timeDetail, 11, 31);
        return { type: "yearly", start: yearStart, end: yearEnd };
      case "custom":
        const [customStart, customEnd] = timeDetail.split(" - ");
        return {
          type: "custom",
          start: new Date(customStart),
          end: new Date(customEnd),
        };
      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const timePeriod = formatTimePeriod();
    if (!timePeriod) {
      toast.error("Invalid time period selected");
      return;
    }
    try {
      const response = await axios.post("/api/reports/create", {
        reportName,
        facilityName,
        timePeriod,
        companyName: user.companyName,
        username: user.username,
      });

      toast.success("Report created successfully!");
      navigate("/datainboard");
    } catch (error) {
      toast.error("Failed to create report. Please try again.");
      console.error("Error creating report:", error);
    }
  };

  const renderTimeDetailInput = () => {
    switch (timePeriodType) {
      case "monthly":
        return (
          <input
            type="month"
            value={timeDetail}
            onChange={(e) => setTimeDetail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        );
      case "quarterly":
        return (
          <select
            value={timeDetail}
            onChange={(e) => setTimeDetail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Select quarter</option>
            <option value="Q1">Q1</option>
            <option value="Q2">Q2</option>
            <option value="Q3">Q3</option>
            <option value="Q4">Q4</option>
          </select>
        );
      case "yearly":
        return (
          <input
            type="number"
            value={timeDetail}
            onChange={(e) => setTimeDetail(e.target.value)}
            placeholder="Enter year (e.g., 2023)"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        );
      case "custom":
        return (
          <div className="flex space-x-2">
            <input
              type="date"
              value={timeDetail.split(" - ")[0] || ""}
              onChange={(e) =>
                setTimeDetail(
                  `${e.target.value} - ${timeDetail.split(" - ")[1] || ""}`
                )
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <input
              type="date"
              value={timeDetail.split(" - ")[1] || ""}
              onChange={(e) =>
                setTimeDetail(
                  `${timeDetail.split(" - ")[0] || ""} - ${e.target.value}`
                )
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <NavbarD />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 p-8 overflow-auto">
          <h2 className="text-2xl font-bold mb-4">
            Create New Report
            {user && user.companyName && ` for ${user.companyName}`}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Report Name
              </label>
              <input
                type="text"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Facility Name
              </label>
              <input
                type="text"
                value={facilityName}
                onChange={(e) => setFacilityName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Time Period Type
              </label>
              <select
                value={timePeriodType}
                onChange={(e) => setTimePeriodType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              >
                <option value="">Select time period type</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
                <option value="custom">Custom Date Range</option>
              </select>
            </div>
            {timePeriodType && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {timePeriodType === "monthly"
                    ? "Month and Year"
                    : timePeriodType === "quarterly"
                    ? "Quarter"
                    : timePeriodType === "yearly"
                    ? "Year"
                    : "Date Range"}
                </label>
                {renderTimeDetailInput()}
              </div>
            )}
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Create Report
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateReport;
