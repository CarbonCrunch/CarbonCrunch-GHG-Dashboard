import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import { FaPlus } from "react-icons/fa";
import Navbar from "../landingPage/Navbar";

const Report = () => {
  const [selectedTab, setSelectedTab] = useState("ongoing");

  const ongoingReports = [
    {
      name: "Q2 Financial Report",
      period: "Apr 2024 - Jun 2024",
      status: "In Progress",
    },
    {
      name: "Environmental Impact Assessment",
      period: "Jan 2024 - Jun 2024",
      status: "Review",
    },
  ];

  const reportHistory = [
    {
      name: "Q1 Financial Report",
      period: "Jan 2024 - Mar 2024",
      status: "Completed",
    },
    {
      name: "Annual Report 2023",
      period: "Jan 2023 - Dec 2023",
      status: "Archived",
    },
  ];

  const renderTable = (reports) => (
    <table className="w-full mt-4 border-collapse">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2 text-left">Report Name</th>
          <th className="p-2 text-left">Time Period</th>
          <th className="p-2 text-left">Action</th>
        </tr>
      </thead>
      <tbody>
        {reports.map((report, index) => (
          <tr key={index} className="border-b">
            <td className="p-2">{report.name}</td>
            <td className="p-2">{report.period}</td>
            <td className="p-2">
              <button className="bg-blue-500 text-white px-2 py-1 rounded">
                {report.status}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
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
          {selectedTab === "ongoing"
            ? renderTable(ongoingReports)
            : renderTable(reportHistory)}
        </div>
      </div>
    </div>
  );
};

export default Report;
