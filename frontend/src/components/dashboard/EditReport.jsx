import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import NavbarD from "./NavbarD";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";
import Fuel from "../reports/Fuel";
import Bioenergy from "../reports/Bioenergy";
import Btls from "../reports/Btls";
import Ec from "../reports/Ec";
import Ehctd from "../reports/Ehctd";
import Fa from "../reports/Fa";
import Fg from "../reports/Fg";
import Food from "../reports/Food";
import HomeOffice from "../reports/HomeOffice";
import Materials from "../reports/Materials";
import Ov from "../reports/Ov";
import Refrigerants from "../reports/Refrigerants";
import Waste from "../reports/Waste";
import Water from "../reports/Water";
import Wttfuels from "../reports/Wttfuels";

const categories = [
  "Bioenergy",
  "BusinessTravel",
  "Electricity_Heating",
  "EmployCommuting",
  "Flights & Accomodations",
  "Food",
  "FreightingGoods",
  "Fuels",
  "Home",
  "MaterialsUsed",
  "OwnedVehicles",
  "Refrigerants",
  "WTTFuel",
  "WasteDisposal",
  "Water",
];

const componentMap = {
  Fuels: Fuel,
  Bioenergy: Bioenergy,
  Refrigerants: Refrigerants,
  Electricity_Heating: Ehctd,
  OwnedVehicles: Ov,
  WTTFuel: Wttfuels,
  MaterialsUsed: Materials,
  WasteDisposal: Waste,
  "Flights & Accomodations": Fa,
  BusinessTravel: Btls,
  FreightingGoods: Fg,
  EmployCommuting: Ec,
  Food: Food,
  Home: HomeOffice,
  Water: Water,
};

const EditReport = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Fuels");
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
        // console.log("ER", response.data.data);
        setReport(response.data.data);
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

  const SelectedComponent = componentMap[selectedCategory];

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
              <div className="flex flex-row items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">
                  Edit Report: {report.reportName}
                </h2>
                <div className="flex items-center">
                  <label htmlFor="category" className="mr-2">
                    Category:
                  </label>
                  <select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="p-2 border rounded"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {SelectedComponent && <SelectedComponent report={report} />}
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
