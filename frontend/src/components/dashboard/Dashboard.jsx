import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import NavbarD from "./NavbarD";
import EmissionBreakdown from "./scopeChart/EmissionBreakdown";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const fetchReports = async () => {
    try {
      let response;

      // Determine the API endpoint based on the user's role
      if (user.role === "Admin") {
        response = await axios.post(
          "/api/reports/getCompanyReport",
          {
            user, // Send user data in the request body
          },
          {
            withCredentials: true, // Ensure cookies are sent
          }
        );
      } else if (user.role === "FacAdmin" || "Employee") {
        response = await axios.post(
          "/api/reports/get",
          {
            user, // Send user data in the request body
          },
          {
            withCredentials: true, // Ensure cookies are sent with the request
          }
        );
      } else {
        throw new Error("Invalid role");
      }

      // Handle "zero" response properly
      if (response.data.data === "zero") {
        setReport([]);
      } else {
        setReport(response.data.data); // Set report as an array
        console.log("ReportComponent", response.data.data);
        // console.log("report", report)
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

  const calculateCO2eTotals = (report) => {
    if (!report) return { total: 0, scope1: 0, scope2: 0, scope3: 0 };

    // Ensure report is treated as an array
    const reportArray = Array.isArray(report) ? report : [report];

    // Initialize totals
    let totalEmissions = 0;
    let scope1Emissions = 0;
    let scope2Emissions = 0;
    let scope3Emissions = 0;

    // Helper function to safely sum up CO2e values from an array
    const sumCO2e = (dataArray) => {
      return Array.isArray(dataArray)
        ? dataArray.reduce((sum, item) => sum + parseFloat(item.CO2e || 0), 0)
        : 0;
    };

    // Iterate through each report object in the array
    reportArray.forEach((report) => {
      // Calculate Scope 1 Emissions (ownedVehicles, bioenergy, refrigerants, fuel)
      scope1Emissions +=
        sumCO2e(report.ownedVehicles) +
        sumCO2e(report.bioenergy) +
        sumCO2e(report.refrigerants) +
        sumCO2e(report.fuel);

      // Calculate Scope 2 Emissions (ehctd)
      scope2Emissions += sumCO2e(report.ehctd);

      // Calculate Scope 3 Emissions (ec, btls, fg, wttfuel, food, material, waste, water, homeOffice)
      scope3Emissions +=
        sumCO2e(report.ec) +
        sumCO2e(report.btls) +
        sumCO2e(report.fg) +
        sumCO2e(report.wttfuel) +
        sumCO2e(report.food) +
        sumCO2e(report.material) +
        sumCO2e(report.waste) +
        sumCO2e(report.water) +
        sumCO2e(report.homeOffice);

      // Calculate Total Emissions by summing all categories
      totalEmissions += scope1Emissions + scope2Emissions + scope3Emissions;
    });

    return {
      total: totalEmissions,
      scope1: scope1Emissions,
      scope2: scope2Emissions,
      scope3: scope3Emissions,
    };
  };

  const { total, scope1, scope2, scope3 } = calculateCO2eTotals(report);

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarD />
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-1/6 sticky top-0 h-screen">
          <Sidebar />
        </div>

        {/* Main content */}
        <div
          className="w-5/6 rounded-lg shadow-lg p-6"
          // style={{ backgroundColor: "#F7F7EF" }}
        >
          <header className="mb-6">
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
              <p className="text-sm text-gray-400">
                Explore your Statistics by selecting year/month from the filter
              </p>
              <div className="flex justify-between mt-4">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium">From:</label>
                  <input type="date" className="px-2 py-1 border rounded" />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium">To:</label>
                  <input type="date" className="px-2 py-1 border rounded" />
                </div>
              </div>
            </div>
          </header>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                {
                  title: "Total Emissions Estimate",
                  color: "#2F4F4F",
                  progressColor: "#32CD32",
                  value: total.toFixed(2), // Display calculated total emissions
                  textColor: "text-white",
                },
                {
                  title: "Scope 1 Emissions",
                  color: "#00008B",
                  progressColor: "#FF0000",
                  value: scope1.toFixed(2), // Display calculated Scope 1 emissions
                  textColor: "text-white",
                },
                {
                  title: "Scope 2 Emissions",
                  color: "#A6D3A0",
                  progressColor: "#8A2BE2",
                  value: scope2.toFixed(2), // Display calculated Scope 2 emissions
                  textColor: "text-black",
                },
                {
                  title: "Scope 3 Emissions",
                  color: "#DDDCBD",
                  progressColor: "#8B4513",
                  value: scope3.toFixed(2), // Display calculated Scope 3 emissions
                  textColor: "text-black",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border border-gray-300 ${item.textColor}`}
                  style={{ backgroundColor: item.color }}
                >
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-2xl font-bold">{item.value} tCO2e</p>
                  <div className="w-full bg-gray-200 h-4 mt-2 rounded-full border border-gray-300">
                    <div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: item.progressColor,
                        width: "50%",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <EmissionBreakdown
            report={user.role === "Admin" ? report : undefined}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
