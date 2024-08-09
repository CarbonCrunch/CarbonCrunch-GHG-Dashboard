import React, { useState, useEffect } from "react";
import axios from "axios";
import Scope1 from "./Scope1";
import Scope2 from "./Scope2";
import Scope3 from "./Scope3";

const EmissionBreakdown = () => {
  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // console.log("reports", reports);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("/api/reports/get");
        if (response.data.data === "zero") {
          setReports(null);
        } else {
          setReports(response.data.data);
          // console.log("ECComponent", response.data.data);
        }
      } catch (err) {
        setError("Failed to fetch reports");
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

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
