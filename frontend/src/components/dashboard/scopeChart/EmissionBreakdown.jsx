import React, { useState, useEffect } from "react";
import axios from "axios";
import Scope1 from "./Scope1";
import Scope2 from "./Scope2";
import Scope3 from "./Scope3";
import { useAuth } from "../../../context/AuthContext";

const EmissionBreakdown = ({ report }) => {
  const [reports, setReports] = useState(report ?? []); // Initialize reports as an array if report is not undefined
  const [loading, setLoading] = useState(!report); // Set loading to false if report is provided
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // console.log("EmissionBreakdown", report);
  // console.log("EmissionBreakdowns", reports);
  // console.log("EmissionBreakdown", user);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.post(
          "/api/reports/get",
          {
            user, // Send user data in the request body
          },
          {
            withCredentials: true, // Ensure cookies are sent with the request
          }
        );

        if (response.data.data === "zero") {
          setReports(() => []); // Set reports as an empty array if response is 'zero'
        } else {
          setReports((prevReports) =>
            Array.isArray(response.data.data)
              ? response.data.data
              : [response.data.data]
          ); // Use callback to set reports
          // console.log("EmissionBreakdown", response.data.data);
        }
      } catch (err) {
        setError("Failed to fetch reports");
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch reports if user is not an Admin and no initial report is provided
    if (user.role !== "Admin" && !report) {
      fetchReports();
    } else if (report) {
      // Set the report directly if provided as prop and not undefined
      setReports((prevReports) => report); // Use callback to set report
      setLoading(false); // Set loading to false because the report is provided
    }
  }, [user, report]); // Include dependencies

  return (
    <div className="p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Emission Breakdown</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="space-y-4">
          <Scope1 reports={reports} />
          <Scope2 reports={reports} />
          <Scope3 reports={reports} />
        </div>
      )}
    </div>
  );
};

export default EmissionBreakdown;
