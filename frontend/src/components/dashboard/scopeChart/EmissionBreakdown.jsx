import React, { useState, useEffect } from "react";
import axios from "axios";
import Scope1 from "./Scope1";
import Scope2 from "./Scope2";
import Scope3 from "./Scope3";
import { useAuth } from "../../../context/AuthContext";
import { useTour } from "../../../context/TourContext";

const EmissionBreakdown = ({ report }) => {
  const [reports, setReports] = useState(report ?? []);
  const [loading, setLoading] = useState(!report);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { runTour, setRunTour } = useTour(); 

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.post(
          "/api/reports/get",
          { user },
          { withCredentials: true }
        );

        if (response.data.data === "zero") {
          setReports([]);
        } else {
          setReports(
            Array.isArray(response.data.data)
              ? response.data.data
              : [response.data.data]
          );
        }
      } catch (err) {
        setError("Failed to fetch reports");
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user.role !== "Admin" && !report) {
      fetchReports();
    } else if (report) {
      setReports(report);
      setLoading(false);
    }
  }, [user, report]);

  return (
    <div className="p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Emission Breakdown</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="tour-scope-charts space-y-4 p-4 rounded-lg transition-all duration-300 hover:shadow-lg">
          <Scope1 reports={reports} />
          <Scope2 reports={reports} />
          <Scope3 reports={reports} />
        </div>
      )}
    </div>
  );
};

export default EmissionBreakdown;
