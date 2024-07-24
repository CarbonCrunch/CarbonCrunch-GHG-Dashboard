import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavbarD from "./NavbarD";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";
import Fuel from "../reports/Fuel";

const EditReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { reportId } = useParams();
  const { user } = useAuth(); 

  useEffect(() => {
    const fetchReport = async () => {
      if (!user) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`/api/reports/${reportId}/get`, {
          params: {
            companyName: user.companyName,
            facilityName: user.facilityName,
          },
        });
        setReport(response.data.data);
        console.log(response.data.data);
        setError(null);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "An error occurred while fetching the report."
        );
        setReport(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId, user]);

  if (!user) {
    return <p>Please log in to view this page.</p>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <NavbarD />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
          {loading ? (
            <p>Loading report...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : report ? (
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Edit Report: {report.reportName}
              </h2>
              <Fuel report={report} />  
            </div>
          ) : (
            <p>No report data available.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default EditReport;
