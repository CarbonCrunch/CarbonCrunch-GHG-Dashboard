import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import NavbarD from "./NavbarD";

const CreateReport = () => {
  const navigate = useNavigate();
  const [reportName, setReportName] = useState("");
  const [facilityName, setFacilityName] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [timeDetail, setTimeDetail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the form submission,
    // such as sending the data to an API
    console.log({ reportName, facilityName, timePeriod, timeDetail });
    navigate("/databoard");
  };

  const renderTimeDetailInput = () => {
    switch (timePeriod) {
      case "1 month":
        return (
          <select
            value={timeDetail}
            onChange={(e) => setTimeDetail(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Select month</option>
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
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
            type="text"
            value={timeDetail}
            onChange={(e) => setTimeDetail(e.target.value)}
            placeholder="Enter financial year"
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
            Create New Report for {NavbarD.companyName}
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
                Time Period
              </label>
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              >
                <option value="">Select time period</option>
                <option value="1 month">1 Month</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
                <option value="custom">Custom Date Range</option>
              </select>
            </div>
            {timePeriod && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {timePeriod === "1 month"
                    ? "Month"
                    : timePeriod === "quarterly"
                    ? "Quarter"
                    : timePeriod === "yearly"
                    ? "Financial Year"
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
