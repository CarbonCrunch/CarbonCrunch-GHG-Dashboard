import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

const Scope1 = ({ reports }) => {
  const [ovData, setOvData] = useState([]);
  const [fuelData, setFuelData] = useState([]);
  const [bioenergyData, setBioenergyData] = useState([]);
  const [refrigerantsData, setRefrigerantsData] = useState([]);
  const [passengerData, setPassengerData] = useState([]);
  const [deliveryData, setDeliveryData] = useState([]);

  const reportData = reports;
  const {
    companyName = "",
    facilityName = "",
    fuel = [],
    ownedVehicles = [],
    reportId = "",
    bioenergy = [],
    refrigerants = [],
  } = reportData || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          fuelResponse,
          bioenergyResponse,
          refrigerantsResponse,
          ovResponse,
        ] = await Promise.all([
          axios.get(`/api/reports/${reportId}/CO2eFuel`, {
            params: {
              companyName,
              facilityName,
              reportId,
              fuel: JSON.stringify(fuel),
            },
          }),
          axios.get(`/api/reports/${reportId}/CO2eBioenergy`, {
            params: {
              companyName,
              facilityName,
              reportId,
              bioenergy: JSON.stringify(bioenergy),
            },
          }),
          axios.get(`/api/reports/${reportId}/CO2eRefrigerants`, {
            params: {
              companyName,
              facilityName,
              reportId,
              refrigerants: JSON.stringify(refrigerants),
            },
          }),
          axios.get(`/api/reports/${reportId}/CO2eOv`, {
            params: {
              companyName,
              facilityName,
              reportId,
              ownedVehicles: JSON.stringify(ownedVehicles),
            },
          }),
        ]);

        setOvData(ovResponse.data.data);
        setFuelData(fuelResponse.data.data);
        setBioenergyData(bioenergyResponse.data.data);
        setRefrigerantsData(refrigerantsResponse.data.data);

        const passengerVehicles = ovResponse.data.data.filter(
          (vehicle) => vehicle.level1 === "Passenger vehicles"
        );
        const deliveryVehicles = ovResponse.data.data.filter(
          (vehicle) => vehicle.level1 === "Delivery vehicles"
        );
        setPassengerData(passengerVehicles);
        setDeliveryData(deliveryVehicles);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [
    reportId,
    companyName,
    facilityName,
    fuel,
    bioenergy,
    refrigerants,
    ownedVehicles,
  ]);

  const chartHeight = 510; // Reduced height by 15%
  const barColors = [
    "#FBAF58",
    "#2E4F50",
    "#A6D39F",
    "#DDDCBD",
    "#51DAD9",
    "#2D92D5",
  ];

  const pieColors = [
    "#39C9EF",
    "#86EAE9",
    "#5DBDD3",
    "#4591B8",
    "#3B6696",
    "#353C6E",
    "#705788",
    "#A5769E",
    "#2D2F36",
    "#D88AAC",
    "#F490A2",
    "#F79A86",
  ];

  const fuelChartData = {
    labels: fuelData.map((item) => item.fuelType),
    datasets: [
      {
        label: "CO2e Emissions",
        data: fuelData.map((item) => item.CO2e),
        backgroundColor: barColors,
        borderColor: barColors,
        borderWidth: 1,
      },
    ],
  };

  const bioenergyChartData = {
    labels: bioenergyData.map((item) => item.fuelType),
    datasets: [
      {
        data: bioenergyData.map((item) => item.CO2e),
        backgroundColor: pieColors,
        borderColor: "#FFFFFF",
        borderWidth: 1,
      },
    ],
  };

  const refrigerantsChartData = {
    labels: refrigerantsData.map((item) => item.emission),
    datasets: [
      {
        label: "CO2e Emissions",
        data: refrigerantsData.map((item) => item.CO2e),
        backgroundColor: barColors,
        borderColor: barColors,
        borderWidth: 1,
      },
    ],
  };

  const tooltipOptions = {
    callbacks: {
      label: function (context) {
        let label = context.dataset.label || "";
        if (label) {
          label += ": ";
        }
        label += `CO2e: ${context.raw}`;
        return label;
      },
    },
    bodyFont: {
      size: 15,
    },
    titleFont: {
      size: 15,
    },
    padding: 16,
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        ticks: {
          display: false, // This hides the scale values
        },
        grid: {
          display: true, // This keeps the grid lines visible
        },
        angleLines: {
          display: false,
        },
        suggestedMin: 0,
        suggestedMax: Math.max(
          ...passengerData.map((item) => item.CO2e),
          ...deliveryData.map((item) => item.CO2e)
        ), // Dynamic scale based on data
      },
    },
    plugins: {
      legend: { display: true }, // Display legend
      title: {
        display: true,
        text: "Emissions from Owned Vehicles",
        font: { size: 22 },
      },
      tooltip: tooltipOptions,
    },
  };

  const passengerChartData = {
    labels: ["Plug-in Hybrid", "Electric", "Petrol", "Diesel", "LPG"],
    datasets: [
      {
        label: "Passenger Vehicles",
        data: passengerData.map((item) => {
          switch (item.level3) {
            case "Plug-in Hybrid":
              return item.CO2e;
            case "Electric":
              return item.CO2e;
            case "Petrol":
              return item.CO2e;
            case "Diesel":
              return item.CO2e;
            case "LPG":
              return item.CO2e;
            default:
              return 0;
          }
        }),
        backgroundColor: pieColors.slice(0, 5),
        borderColor: "#2F4F4F",
        borderWidth: 1,
      },
    ],
  };

  const deliveryChartData = {
    labels: ["Petrol", "Diesel", "Electric", "CNG"],
    datasets: [
      {
        label: "Delivery Vehicles",
        data: deliveryData.map((item) => {
          switch (item.level3) {
            case "Petrol":
              return item.CO2e;
            case "Diesel":
              return item.CO2e;
            case "Electric":
              return item.CO2e;
            case "CNG":
              return item.CO2e;
            default:
              return 0;
          }
        }),
        backgroundColor: pieColors.slice(0, 4),
        borderColor: "#2F4F4F",
        borderWidth: 1,
      },
    ],
  };

  const fuelOptions = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Fuel Emissions",
        font: { size: 22 },
      },
      tooltip: tooltipOptions,
    },
    scales: {
      y: {
        display: false, // Remove categories from y-axis
      },
    },
  };

  const bioenergyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Bioenergy Emissions",
        font: { size: 22 },
      },
      tooltip: tooltipOptions,
    },
  };

  const refrigerantsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Refrigerants Emissions",
        font: { size: 22 },
      },
      tooltip: tooltipOptions,
    },
    scales: {
      x: {
        display: false, // Remove types of gases from x-axis
      },
    },
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-2">
        Scope 1: Direct emissions arising from owned or controlled stationary
        sources that use fossil fuels and/or emit fugitive emissions
      </h3>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 h-[510px] ">
          <div
            className="w-1/2 p-2 rounded-lg border border-gray-900 shadow-lg"
            style={{ backgroundColor: "#F5F5F5" }}
          >
            <Bar
              data={fuelChartData}
              options={fuelOptions}
              height={chartHeight}
            />
          </div>
          <div
            className="w-1/2 p-2 rounded-lg border border-gray-900 shadow-lg"
            style={{ backgroundColor: "#F5F5F5" }}
          >
            <Pie
              data={bioenergyChartData}
              options={bioenergyOptions}
              height={chartHeight}
            />
          </div>
        </div>
        <div className="flex gap-4 h-[510px]">
          <div
            className="w-1/2 p-2 rounded-lg border border-gray-900 shadow-lg"
            style={{ backgroundColor: "#F5F5F5" }}
          >
            <Radar
              data={passengerChartData}
              options={radarOptions}
              height={chartHeight}
            />
          </div>
          <div
            className="w-1/2 p-2 rounded-lg border border-gray-900 shadow-lg"
            style={{ backgroundColor: "#F5F5F5" }}
          >
            <Radar
              data={deliveryChartData}
              options={radarOptions}
              height={chartHeight}
            />
          </div>
        </div>
        <div className="flex gap-4 h-[510px]">
          <div
            className="w-full p-2 rounded-lg border border-gray-900 shadow-lg"
            style={{ backgroundColor: "#F5F5F5" }}
          >
            <Bar
              data={refrigerantsChartData}
              options={refrigerantsOptions}
              height={chartHeight}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scope1;
