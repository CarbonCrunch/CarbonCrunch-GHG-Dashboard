import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Sidebar from "./Sidebar";
import NavbarD from "./NavbarD";
import EmissionBreakdown from "./scopeChart/EmissionBreakdown";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Vehicles",
        data: [50, 40, 60, 20, 30, 40, 50],
        backgroundColor: "#2F4F4F",
      },
      {
        label: "Technology",
        data: [30, 20, 40, 25, 40, 35, 30],
        backgroundColor: "#3E6B6B",
      },
      {
        label: "Buildings",
        data: [80, 60, 70, 30, 50, 70, 60],
        backgroundColor: "#507C7C",
      },
      {
        label: "Manufacturing",
        data: [20, 15, 25, 10, 15, 20, 25],
        backgroundColor: "#619D9D",
      },
      {
        label: "Other",
        data: [40, 30, 50, 20, 30, 40, 35],
        backgroundColor: "#72AFAF",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    },
  };

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

          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              {
                title: "Total Emissions Estimate",
                color: "#FFFFFF",
                borderColor: "#000000",
              },
              {
                title: "Scope 1 Emissions",
                color: "#FFC0CB",
                borderColor: "#FF69B4",
              },
              {
                title: "Scope 2 Emissions",
                color: "#ADD8E6",
                borderColor: "#1E90FF",
              },
              {
                title: "Scope 3 Emissions",
                color: "#FFFFE0",
                borderColor: "#FFD700",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="text-black p-4 rounded-lg"
                style={{
                  backgroundColor: item.color,
                  border: `2px solid ${item.borderColor}`,
                }}
              >
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-2xl font-bold">100976.120 tCO2e</p>
                <div className="w-full bg-white bg-opacity-30 h-2 mt-2 rounded-full">
                  <div className="bg-black w-1/2 h-full rounded-full"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div
              className="p-4 rounded-lg flex flex-col justify-between"
              style={{ backgroundColor: "#DDDCBD", height: "100%" }}
            >
              <h3 className="font-semibold mb-2">Emission Breakdown</h3>
              {/* Content for emission breakdown */}
            </div>
            <div
              className="p-4 rounded-lg flex flex-col justify-between"
              style={{ backgroundColor: "#DDDCBD", height: "100%" }}
            >
              <h3 className="font-semibold mb-2">Carbon Footprint</h3>
              <p className="text-lg font-bold">2,412,314t CO2e</p>
              <Bar data={chartData} options={chartOptions} />
            </div>
            <div
              className="p-4 rounded-lg flex flex-col justify-between"
              style={{ backgroundColor: "#DDDCBD", height: "100%" }}
            >
              <h3 className="font-semibold mb-2">Against your Industry</h3>
              {/* Content for industry comparison */}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div
              className="p-4 rounded-lg flex flex-col justify-between"
              style={{ backgroundColor: "#DDDCBD", height: "100%" }}
            >
              <h3 className="font-semibold mb-2">Additional Breakdown</h3>
              {/* Content for additional breakdown */}
            </div>
            <div
              className="p-4 rounded-lg flex flex-col justify-between"
              style={{ backgroundColor: "#DDDCBD", height: "100%" }}
            >
              <h3 className="font-semibold mb-2">Additional Information</h3>
              {/* Content for additional information */}
            </div>
          </div>

          <EmissionBreakdown />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
