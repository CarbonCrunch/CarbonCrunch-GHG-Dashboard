import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Line, Pie, Bubble } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Scope3 = ({ reports }) => {
  const [wttFuelData, setWttFuelData] = useState([]);
  const [homeOfficeData, setHomeOfficeData] = useState([]);

  const reportData = reports || {};
  const {
    companyName = "",
    facilityName = "",
    reportId = "",
    wttfuel = [],
    homeOffice = [],
  } = reportData;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [wttFuelResponse, homeOfficeResponse] = await Promise.all([
          axios.get(`/api/reports/${reportId}/CO2eWTTFuel`, {
            params: {
              companyName,
              facilityName,
              reportId,
              wttfuel: JSON.stringify(wttfuel),
            },
          }),
          axios.get(`/api/reports/${reportId}/CO2eHome`, {
            params: {
              companyName,
              facilityName,
              reportId,
              homeOffice: JSON.stringify(homeOffice),
            },
          }),
        ]);

        setWttFuelData(wttFuelResponse.data.data);
        setHomeOfficeData(homeOfficeResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [reportId, companyName, facilityName, wttfuel, homeOffice]);

  const chartHeight = 450;

  const tooltipOptions = {
    bodyFont: {
      size: 15, // Set font size to 15
    },
    titleFont: {
      size: 15, // Set font size to 15
    },
    padding: 16, // Increase padding for better visibility
  };

  const baseColor = "rgba(47, 79, 79, 1)"; // #2F4F4F with 60% opacity
  const baseBorderColor = "rgba(47, 79, 79, 1)"; // Solid #2F4F4F

  // Hotel Accommodation data
  const hotelAccommodationDataC = {
    labels: ["1 Star", "2 Star", "3 Star", "4 Star", "5 Star"],
    datasets: [
      {
        data: [300, 500, 800, 1200, 1500],
        backgroundColor: [
          "rgba(0, 63, 92, 0.8)",
          "rgba(88, 80, 141, 0.8)",
          "rgba(188, 80, 144, 0.8)",
          "rgba(255, 99, 97, 0.8)",
          "rgba(255, 166, 0, 0.8)",
        ],
      },
    ],
  };

  const hotelAccommodationOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Hotel Accommodation Emissions",
        font: { size: 15 },
      },
      tooltip: tooltipOptions,
    },
    cutout: "50%",
  };

  // Update Home Office data for bubble chart
  const homeOfficeDataC = {
    datasets: [
      {
        label: "Heating",
        data: [{ x: 20, y: 30, r: 15 }],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
      {
        label: "Cooling",
        data: [{ x: 40, y: 10, r: 10 }],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "No Heating/Cooling",
        data: [{ x: 30, y: 20, r: 20 }],
        backgroundColor: "rgba(255, 206, 86, 0.6)",
      },
    ],
  };

  const homeOfficeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Home Office Emissions",
        font: { size: 15 },
      },
      tooltip: tooltipOptions,
    },
    scales: {
      x: { title: { display: true, text: "Energy Consumption" } },
      y: { title: { display: true, text: "CO2e Emissions" } },
    },
  };

  // Employee commuting data for cars
  const carCommutingData = {
    labels: ["Small", "Average", "Medium", "Large"],
    datasets: [
      {
        label: "Petrol",
        data: [120, 150, 180, 220],
        backgroundColor: "rgba(255, 0, 0, 0.7)",
      },
      {
        label: "Diesel",
        data: [110, 140, 170, 210],
        backgroundColor: "rgba(255, 127, 0, 0.7)",
      },
      {
        label: "Hybrid",
        data: [90, 120, 150, 190],
        backgroundColor: "rgba(255, 255, 0, 0.7)",
      },
      {
        label: "Electric",
        data: [70, 100, 130, 170],
        backgroundColor: "rgba(0, 255, 0, 0.7)",
      },
    ],
  };

  // Employee commuting data for public transport
  const publicTransportData = {
    labels: ["Bus", "Rental Car", "Taxi", "Train"],
    datasets: [
      {
        label: "Diesel",
        data: [80, 140, 130, 60],
        backgroundColor: "rgba(255, 0, 0, 0.7)",
      },
      {
        label: "CNG",
        data: [70, 130, 120, 55],
        backgroundColor: "rgba(255, 127, 0, 0.7)",
      },
      {
        label: "Electric",
        data: [50, 100, 90, 40],
        backgroundColor: "rgba(255, 255, 0, 0.7)",
      },
      {
        label: "Hybrid",
        data: [60, 120, 110, 50],
        backgroundColor: "rgba(0, 255, 0, 0.7)",
      },
    ],
  };

  const commutingOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Employee Commuting Emissions",
        font: { size: 15 },
      },
      tooltip: tooltipOptions,
    },
    scales: {
      x: { title: { display: true, text: "Vehicle Type" } },
      y: { title: { display: true, text: "CO2e Emissions" } },
    },
  };

  // Business Travel data
  const businessTravelData = {
    labels: ["Taxi", "Rail", "Motorbike", "Ferry", "Car (average)", "Buses"],
    datasets: [
      {
        label: "Plug-in Hybrid Electric Vehicle",
        data: [10, 0, 0, 5, 15, 0],
        backgroundColor: "#FF6384",
      },
      {
        label: "Battery Electric Vehicle",
        data: [5, 20, 0, 0, 10, 15],
        backgroundColor: "#36A2EB",
      },
      {
        label: "Diesel",
        data: [20, 15, 5, 25, 30, 40],
        backgroundColor: "#FFCE56",
      },
      {
        label: "Petrol",
        data: [25, 0, 15, 0, 35, 10],
        backgroundColor: "#4BC0C0",
      },
    ],
  };

  const businessTravelOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Business Travel Emissions",
        font: { size: 15 },
      },
      tooltip: tooltipOptions,
    },
    scales: {
      x: { stacked: true, title: { display: true, text: "CO2e Emissions" } },
      y: { stacked: true },
    },
  };

  const barColors = [
    "#FBAF58",
    "#2E4F50",
    "#A6D39F",
    "#DDDCBD",
    "#51DAD9",
    "#2D92D5",
  ];

  // Freighting goods data for vans, trucks, and ships
  const freightingGoodsData = [
    {
      title: "Vans",
      data: {
        labels: [100, 200, 300, 400, 500],
        datasets: [
          {
            label: "Petrol",
            data: [10, 20, 30, 40, 50],
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
          },
          {
            label: "Diesel",
            data: [15, 25, 35, 45, 55],
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
          },
          {
            label: "Electric",
            data: [20, 30, 40, 50, 60],
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
          },
        ],
      },
    },
    {
      title: "Trucks",
      data: {
        labels: [100, 200, 300, 400, 500],
        datasets: [
          {
            label: "Petrol",
            data: [20, 30, 40, 50, 60],
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
          },
          {
            label: "Diesel",
            data: [25, 35, 45, 55, 65],
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
          },
          {
            label: "Electric",
            data: [30, 40, 50, 60, 70],
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
          },
        ],
      },
    },
    {
      title: "Ships",
      data: {
        labels: [100, 200, 300, 400, 500],
        datasets: [
          {
            label: "Heavy Fuel Oil",
            data: [30, 40, 50, 60, 70],
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
          },
          {
            label: "Marine Diesel Oil",
            data: [35, 45, 55, 65, 75],
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
          },
          {
            label: "Liquefied Natural Gas",
            data: [40, 50, 60, 70, 80],
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
          },
        ],
      },
    },
  ];

  const freightingGoodsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Emissions from Freighting Goods",
        font: { size: 15 },
      },
      tooltip: tooltipOptions,
    },
    scales: {
      x: { title: { display: true, text: "Distance (km)" } },
      y: { title: { display: true, text: "CO2e Emissions" } },
    },
  };

  // Update WTT Fuel chart data to use new colors
  const wttFuelChartData = {
    labels: wttFuelData.map((item) => item.fuel),
    datasets: [
      {
        label: "CO2e Emissions",
        data: wttFuelData.map((item) => item.CO2e),
        backgroundColor: barColors,
        borderColor: barColors,
        borderWidth: 1,
      },
    ],
  };

  const wttFuelOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Emissions from WTT Fuel",
        font: { size: 15 },
      },
      tooltip: tooltipOptions,
    },
  };

  // Combined chart data
  const combinedChartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Food",
        data: [65, 59, 80, 81, 56, 55, 40, 45, 50, 60, 70, 75],
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        fill: true,
      },
      {
        label: "Water",
        data: [28, 48, 40, 19, 86, 27, 90, 85, 80, 75, 70, 65],
        borderColor: "yellow",
        backgroundColor: "rgba(255, 255, 0, 0.2)",
        fill: true,
      },
    ],
  };

  const combinedChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Combined Food and Water Emissions",
        font: { size: 15 },
      },
      tooltip: tooltipOptions,
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "CO2e Emissions" },
      },
    },
  };

  // Chart data for material and waste
  const materialWasteChartData = {
    labels: ["Material", "Waste"],
    datasets: [
      {
        label: "Material CO2e Emissions",
        data: [150, 100],
        backgroundColor: baseColor,
        borderColor: baseBorderColor,
        borderWidth: 1,
        fill: false,
      },
      {
        label: "Waste CO2e Emissions",
        data: [100, 150],
        backgroundColor: "rgba(75, 107, 107, 0.6)", // Lighter tone for differentiation
        borderColor: "rgba(75, 107, 107, 1)",
        borderWidth: 1,
        fill: false,
      },
    ],
  };

  const materialWasteOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Emissions from Material and Waste",
        font: { size: 15 },
      },
      tooltip: tooltipOptions,
    },
  };

  const fgData = [
    {
      title: "Vans",
      data: [
        { distance: 100, CO2e: 50 },
        { distance: 200, CO2e: 90 },
        { distance: 300, CO2e: 130 },
        { distance: 400, CO2e: 180 },
        { distance: 500, CO2e: 220 },
      ],
    },
    {
      title: "Trucks",
      data: [
        { distance: 100, CO2e: 100 },
        { distance: 200, CO2e: 180 },
        { distance: 300, CO2e: 270 },
        { distance: 400, CO2e: 360 },
        { distance: 500, CO2e: 450 },
      ],
    },
    {
      title: "Ships",
      data: [
        { distance: 100, CO2e: 200 },
        { distance: 200, CO2e: 380 },
        { distance: 300, CO2e: 570 },
        { distance: 400, CO2e: 760 },
        { distance: 500, CO2e: 950 },
      ],
    },
  ];

  return (
    <div>
      <h1 className="text-lg font-bold mb-2 pt-8">
        Scope 3: Indirect emissions from employee commuting, business travel and
        lodging, freighting goods, and other categories
      </h1>

      <div className="flex flex-col gap-4">
        <div
          className="w-full h-[450px]"
          style={{ backgroundColor: "#F5F5F5" }}
        >
          <Line
            data={{
              labels:
                fgData && fgData.length && fgData[0].data
                  ? fgData[0].data.map((item) => item.distance || "Unknown")
                  : ["No data"],
              datasets:
                fgData && fgData.length && fgData[0].data
                  ? fgData.map((vehicle, index) => ({
                      label: vehicle.title || "Unknown",
                      data: vehicle.data
                        ? vehicle.data.map((item) => item.CO2e || 0)
                        : [],
                      borderColor: `rgba(54, 162, 235, ${index + 0.2})`,
                      backgroundColor: `rgba(54, 162, 235, 0.${index + 2})`,
                      fill: true,
                    }))
                  : [
                      {
                        label: "No data",
                        data: [0],
                        borderColor: "rgba(200, 200, 200, 1)",
                        backgroundColor: "rgba(200, 200, 200, 0.2)",
                        fill: true,
                      },
                    ],
            }}
            options={{
              ...combinedChartOptions,
              plugins: {
                ...combinedChartOptions.plugins,
                title: {
                  ...combinedChartOptions.plugins.title,
                  text: `Emissions from Vans, Trucks, and Ships`,
                },
              },
            }}
            height={chartHeight}
          />
        </div>

        <div className="flex gap-4 h-[450px]">
          <div
            className="w-1/2 p-2 rounded-lg border border-gray-900 shadow-lg"
            style={{ backgroundColor: "#F5F5F5" }}
          >
            <Bar
              data={carCommutingData}
              options={{
                ...commutingOptions,
                plugins: {
                  ...commutingOptions.plugins,
                  title: {
                    ...commutingOptions.plugins.title,
                    text: "Car Commuting Emissions",
                  },
                },
              }}
              height={chartHeight}
            />
          </div>
          <div
            className="w-1/2 p-2 rounded-lg border border-gray-900 shadow-lg"
            style={{ backgroundColor: "#F5F5F5" }}
          >
            <Bar
              data={publicTransportData}
              options={{
                ...commutingOptions,
                plugins: {
                  ...commutingOptions.plugins,
                  title: {
                    ...commutingOptions.plugins.title,
                    text: "Public Transport Emissions",
                  },
                },
              }}
              height={chartHeight}
            />
          </div>
        </div>

        <div className="flex gap-4 h-[450px]">
          <div
            className="w-1/2 p-2 rounded-lg border border-gray-900 shadow-lg"
            style={{ backgroundColor: "#F5F5F5" }}
          >
            <Bar
              data={businessTravelData}
              options={businessTravelOptions}
              height={chartHeight}
            />
          </div>
          <div
            className="w-1/2 p-2 rounded-lg border border-gray-900 shadow-lg"
            style={{ backgroundColor: "#F5F5F5" }}
          >
            <Line
              data={materialWasteChartData}
              options={materialWasteOptions}
              height={chartHeight}
            />
          </div>
        </div>

        <div className="flex gap-4 h-[450px]">
          <div
            className="w-1/2 p-2 rounded-lg border border-gray-900 shadow-lg"
            style={{ backgroundColor: "#F5F5F5" }}
          >
            <Bar
              data={wttFuelChartData}
              options={wttFuelOptions}
              height={chartHeight}
            />
          </div>
          <div className="w-1/2 flex flex-col gap-4">
            <div
              className="h-1/2 p-2 rounded-lg border border-gray-900 shadow-lg"
              style={{ backgroundColor: "#F5F5F5" }}
            >
              <Bubble
                data={homeOfficeDataC}
                options={homeOfficeOptions}
                height={chartHeight / 2}
              />
            </div>
            <div className="h-1/2 flex gap-4">
              <div
                className="w-1/2 p-2 rounded-lg border border-gray-900 shadow-lg"
                style={{ backgroundColor: "#F5F5F5" }}
              >
                <Line
                  data={combinedChartData}
                  options={combinedChartOptions}
                  height={chartHeight / 2}
                />
              </div>
              <div
                className="w-1/2 p-2 rounded-lg border border-gray-900 shadow-lg"
                style={{ backgroundColor: "#F5F5F5" }}
              >
                <Pie
                  data={hotelAccommodationDataC}
                  options={hotelAccommodationOptions}
                  height={chartHeight / 2}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scope3;
