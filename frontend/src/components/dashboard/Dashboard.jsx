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
        backgroundColor: "#FFD700",
      },
      {
        label: "Technology",
        data: [30, 20, 40, 25, 40, 35, 30],
        backgroundColor: "#FFA500",
      },
      {
        label: "Buildings",
        data: [80, 60, 70, 30, 50, 70, 60],
        backgroundColor: "#1E90FF",
      },
      {
        label: "Manufacturing",
        data: [20, 15, 25, 10, 15, 20, 25],
        backgroundColor: "#4169E1",
      },
      {
        label: "Other",
        data: [40, 30, 50, 20, 30, 40, 35],
        backgroundColor: "#32CD32",
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
        <Sidebar />

        {/* Main content */}
        <div className="w-4/5 bg-orange-100 p-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <header className="mb-6">
              <div className="bg-gray-100 rounded-lg p-4 mb-4">
                <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
                <p className="text-sm text-gray-400">
                  Explore your Statistics by selecting year/month from the
                  filter
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
                { title: "Total Emissions Estimate", color: "bg-green-700" },
                { title: "Scope 1 Emissions", color: "bg-blue-900" },
                { title: "Scope 2 Emissions", color: "bg-green-200" },
                { title: "Scope 3 Emissions", color: "bg-yellow-700" },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`${item.color} text-white p-4 rounded-lg`}
                >
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-2xl font-bold">100976.120 tCO2e</p>
                  <div className="w-full bg-white bg-opacity-30 h-2 mt-2 rounded-full">
                    <div className="bg-white w-1/2 h-full rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Emission Breakdown</h3>
                {/* Content for emission breakdown */}
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Carbon Footprint</h3>
                <p className="text-lg font-bold">2,412,314t CO2e</p>
                <Bar data={chartData} options={chartOptions} />
              </div>
              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Against your Industry</h3>
                  {/* Content for industry comparison */}
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Additional Breakdown</h3>
                  {/* Content for additional breakdown */}
                </div>
              </div>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-2">Additional Information</h3>
              {/* Content for the full-width box */}
            </div>
            <EmissionBreakdown />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
