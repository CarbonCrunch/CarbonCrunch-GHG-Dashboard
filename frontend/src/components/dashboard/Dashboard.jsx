import React from "react";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
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
  ArcElement,
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
        backgroundColor: "#FFD700", // Yellow
      },
      {
        label: "Technology",
        data: [30, 20, 40, 25, 40, 35, 30],
        backgroundColor: "#FFA500", // Orange
      },
      {
        label: "Buildings",
        data: [80, 60, 70, 30, 50, 70, 60],
        backgroundColor: "#87CEEB", // Sky Blue
      },
      {
        label: "Manufacturing",
        data: [20, 15, 25, 10, 15, 20, 25],
        backgroundColor: "#800080", // Purple
      },
      {
        label: "Other",
        data: [40, 30, 50, 20, 30, 40, 35],
        backgroundColor: "#00CED1", // Dark Turquoise
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

  const esgScoreData = {
    datasets: [{
      data: [20, 20, 20, 20, 20],
      backgroundColor: ['#32CD32', '#1E90FF', '#FFD700', '#FFA500', '#FF0000'],
      circumference: 180,
      rotation: 270,
    }]
  };

  const esgScoreOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    cutout: '70%',
  };

 const emissionBreakdownData = {
   datasets: [
     {
       // Innermost pie chart (CC)
       data: [100],
       backgroundColor: ["#FF6384"],
       label: "CC",
     },
     {
       // Middle donut chart (Scopes)
       data: [30, 40, 30],
       backgroundColor: ["#36A2EB", "#FFCE56", "#4BC0C0"],
       label: "Scope",
     },
     {
       // Outermost donut chart (Details)
       data: [12.5, 12.5, 12.5, 12.5, 12.5, 12.5, 12.5, 12.5],
       backgroundColor: [
         "#FF6384",
         "#36A2EB",
         "#FFCE56",
         "#4BC0C0",
         "#9966FF",
         "#FF9F40",
         "#FF6384",
         "#36A2EB",
       ],
       label: "Details",
     },
   ],
   labels: [
     "CC",
     "Scope 1",
     "Scope 2",
     "Scope 3",
     "Fuels",
     "Home",
     "MaterialsUsed",
     "OwnedVehicles",
     "Refrigerants",
     "WTTFuel",
     "WasteDisposal",
     "Water",
   ],
 };

 const emissionBreakdownOptions = {
   responsive: true,
   maintainAspectRatio: false,
   plugins: {
     tooltip: {
       callbacks: {
         label: function (context) {
           let label = context.label || "";
           if (label && context.datasetIndex === 0) {
             label = "CC";
           } else if (label && context.datasetIndex === 1) {
             label = ["Scope 1", "Scope 2", "Scope 3"][context.dataIndex];
           } else if (label) {
             label = [
               "Fuels",
               "Home",
               "MaterialsUsed",
               "OwnedVehicles",
               "Refrigerants",
               "WTTFuel",
               "WasteDisposal",
               "Water",
             ][context.dataIndex];
           }
           if (label && context.parsed !== null) {
             label += ": " + context.parsed + "%";
           }
           return label;
         },
       },
     },
     legend: {
       display: false,
     },
   },
   cutout: "0%", // for the innermost pie chart
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
                color: "#2F4F4F",
                progressColor: "#32CD32",
                value: "150976.120",
              },
              {
                title: "Scope 1 Emissions",
                color: "#00008B",
                progressColor: "#FF0000",
                value: "50976.120",
              },
              {
                title: "Scope 2 Emissions",
                color: "#A6D3A0",
                progressColor: "#8A2BE2",
                value: "75976.120",
              },
              {
                title: "Scope 3 Emissions",
                color: "#DDDCBD",
                progressColor: "#8B4513",
                value: "100976.120",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="text-black p-4 rounded-lg border border-gray-300"
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

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="p-4 rounded-lg flex flex-col justify-between bg-white border border-gray-300">
              <h3 className="font-semibold mb-2">Emission Breakdown</h3>
              <div className="h-64 relative">
                <Doughnut
                  data={{
                    datasets: [
                      emissionBreakdownData.datasets[0],
                      { ...emissionBreakdownData.datasets[1], cutout: "30%" },
                      { ...emissionBreakdownData.datasets[2], cutout: "60%" },
                    ],
                    labels: emissionBreakdownData.labels,
                  }}
                  options={emissionBreakdownOptions}
                />
              </div>
            </div>
            <div className="p-4 rounded-lg flex flex-col justify-between bg-white border border-gray-300">
              <h3 className="font-semibold mb-2">Carbon Footprint</h3>
              <p className="text-lg font-bold">2,914t CO2e</p>
              <Bar data={chartData} options={chartOptions} />
            </div>
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-lg flex flex-col justify-between bg-white border border-gray-300 h-1/2">
                <h3 className="font-semibold mb-2">Against your Industry</h3>
                {/* Content for industry comparison */}
              </div>
              <div className="p-4 rounded-lg flex flex-col justify-between bg-white border border-gray-300 h-1/2">
                <h3 className="font-semibold mb-2">ESG Score</h3>
                <div className="h-40 relative">
                  <Doughnut data={esgScoreData} options={esgScoreOptions} />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-1 h-16 bg-black origin-bottom transform rotate-45"></div>
                  </div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-sm font-bold">
                    70%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <EmissionBreakdown />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

