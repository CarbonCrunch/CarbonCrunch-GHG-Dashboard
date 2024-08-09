import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import Sidebar from "./Sidebar";
import NavbarD from "./NavbarD";
import { useAuth } from "../../context/AuthContext";
import Fuel from "../reports/Fuel";
import Bioenergy from "../reports/Bioenergy";
import Refrigerants from "../reports/Refrigerants";
import Ec from "../reports/Ec";
import Ov from "../reports/Ov";
import Wttfuels from "../reports/Wttfuels";
import Materials from "../reports/Materials";
import Waste from "../reports/Waste";
import Fa from "../reports/Fa";
import Btls from "../reports/Btls";
import Fg from "../reports/Fg";
import Ehctd from "../reports/Ehctd";
import Food from "../reports/Food";
import HomeOffice from "../reports/HomeOffice";
import Water from "../reports/Water";
import { ToastContainer } from "react-toastify";

ChartJS.register(ArcElement, Tooltip, Legend);

const DataInBoard = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Fuels");
  const { user } = useAuth();
  const today = new Date();
  const tenYearsAgo = new Date(today);
  tenYearsAgo.setFullYear(today.getFullYear() - 10);

  const [startDate, setStartDate] = useState(tenYearsAgo);
  const [endDate, setEndDate] = useState(today);

  useEffect(() => {
    const fetchReport = async () => {
      if (!user) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`/api/reports/get`);
        if (response.data.data === "zero") {
          setReport([]);
        } else {
          setReport(response.data.data);
        }
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
  }, [user]);

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
    OwnedVehicles: Ov,
    WTTFuel: Wttfuels,
    MaterialsUsed: Materials,
    WasteDisposal: Waste,
    "Flights & Accomodations": Fa,
    Electricity_Heating: Ehctd,
    BusinessTravel: Btls,
    FreightingGoods: Fg,
    EmployCommuting: Ec,
    Food: Food,
    Home: HomeOffice,
    Water: Water,
  };

  const pieData = {
    labels: ["Diesel", "Petrol", "Natural Gas", "LPG", "Coal", "Other"],
    datasets: [
      {
        data: [30, 25, 20, 15, 7, 3],
        backgroundColor: [
          "#4CAF50",
          "#8BC34A",
          "#CDDC39",
          "#FFEB3B",
          "#FFC107",
          "#FF9800",
        ],
        borderColor: "#FFFFFF",
        borderWidth: 2,
      },
    ],
  };

  const SelectedComponent = componentMap[selectedCategory];

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarD />
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-1/6 sticky top-0 h-screen">
          <Sidebar />
        </div>
        <div className="flex-1 p-6 bg-white">
          <h1 className="text-2xl font-bold mb-4">{selectedCategory}</h1>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                className="border p-2 rounded"
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className="border p-2 rounded"
              />
              <button className="p-2 bg-green-500 text-white rounded">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>
            <div className="flex items-center ml-auto mr-20">
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

          <div className="flex mr-18">
            <div className="w-full h-96 pt-18">
              <Pie
                data={pieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  cutout: "50%",
                }}
              />
            </div>
            <div className="w-1/3 pr-12 mt-12">
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Total Footprints</p>
                  <p className="text-2xl font-bold">777.00 kg CO2-eq</p>
                  <p className="text-green-500">
                    -10% less than industry average
                  </p>
                </div>
                <div>
                  <p className="font-medium">Average Footprint / Activity</p>
                  <p className="text-2xl font-bold">13.17 kg CO2-eq</p>
                  <p className="text-green-500">
                    -10% less than industry average
                  </p>
                </div>
              </div>
            </div>
          </div>

          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6 mt-20">
            {loading ? (
              <p>Loading report...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : report ? (
              <div>
                {SelectedComponent && <SelectedComponent report={report} />}
              </div>
            ) : (
              <p>No report data available.</p>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DataInBoard;
