import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Sidebar from "./Sidebar";
import NavbarD from "./NavbarD";

ChartJS.register(ArcElement, Tooltip, Legend);

const DataInBoard = () => {
  const [startDate, setStartDate] = useState(new Date("2023-05-16"));
  const [endDate, setEndDate] = useState(new Date("2024-05-16"));
  const [category, setCategory] = useState("Fuels");

  const categories = [
    "Fuels",
    "Bioenergy",
    "Refrigerants",
    "Electricity",
    "OwnedVehicles",
    "WTTFuel",
    "MaterialsUsed",
    "WasteDisposal",
    "Flights & Accomodations",
    "BusinessTravel",
    "FreightingGoods",
    "EmployCommuting",
    "Food",
    "Home",
    "Water",
  ];

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

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarD /> {/* Add the Header component here */}
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-6 bg-white">
          <h1 className="text-2xl font-bold mb-4">{category}</h1>
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
            <h3 className="text-xl font-semibold mb-4">Category</h3>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border p-2 rounded"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex">
            <div className="w-2/3">
              <Pie
                data={pieData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
            <div className="w-1/3 pl-6">
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

          <div className="mt-6 flex space-x-4">
            <button className="px-4 py-2 bg-green-500 text-white rounded">
              + Add Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataInBoard;
